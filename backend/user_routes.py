from flask import Flask
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import mysql
import bcrypt

user_bp = Blueprint('user', __name__)

@user_bp.route('/getUser', methods=['GET'])
@jwt_required()
def get_user():
    
    user_id = get_jwt_identity()
    
    try:
        if not isinstance(user_id, int):
            return jsonify({'error': 'Identifiant utilisateur invalide'}), 400

        with mysql.connection.cursor() as cur:
            cur.execute("SELECT * FROM utilisateurs WHERE id_user = %s", (user_id,))
            user = cur.fetchone()

            if user:
                return jsonify(user), 200
            else:
                return jsonify({'error': 'Aucun utilisateur trouvé'}), 404

    except mysql.Error as e:
        return jsonify({'error': f'Erreur MySQL : {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500


# Route pour ajouter un utilisateur
@user_bp.route('/setUser', methods=['POST', 'OPTIONS'])
def setUser():
    if request.method == 'OPTIONS':
        return '', 204

    try:
        data = request.get_json()
        nom = data.get('nom')
        prenom = data.get('prenom')
        role = data.get('role')
        email = data.get('email')
        password = data.get('password')
        id_gerant = data.get('userId')
        annee = data.get('annee')
        est_valide = 1

        # Vérification des champs requis
        if not nom or not prenom or not role or not email or not password or not annee:
            print('Champs requis manquants:', nom, prenom, role, email, password, annee)
            return jsonify({'error': 'Tous les champs sont requis'}), 400

        cur = mysql.connection.cursor()

        # Récupération de l'id_formation en utilisant id_gerant
        cur.execute("SELECT id_formation FROM formation WHERE id_gerant_formation = %s", (id_gerant,))
        id_formation = cur.fetchone()
        if not id_formation:
            print('Aucune formation trouvée pour le gérant:', id_gerant)
            return jsonify({'error': "L'utilisateur n'est gérant d'aucune formation"}), 400
        id_formation = id_formation['id_formation']
        print('Formation trouvée:', id_formation)
        
        # Récupération de l'id_annee
        cur.execute("SELECT id_annee FROM annees WHERE id_formation = %s AND annee = %s", (id_formation, annee,))
        id_annee = cur.fetchone()
        if not id_annee:
            print('Aucune année trouvée pour la formation:', id_formation, 'et l\'année:', annee)
            return jsonify({'error': "L'année spécifiée n'existe pas"}), 400
        id_annee = id_annee['id_annee']
        print('Année trouvée:', id_annee)

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
        print('Mot de passe haché:', hashed_password)

        # Insertion de l'utilisateur avec l'id de l'année et l'id de la formation
        sql_query = "INSERT INTO utilisateurs (nom, prenom, password, role, email, id_gerant, id_annee, id_formation, est_valide) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        cur.execute(sql_query, (nom, prenom, hashed_password, role, email, id_gerant, int(id_annee), int(id_formation), est_valide))
        mysql.connection.commit()
        cur.close()
        print('Utilisateur ajouté avec succès')

        return jsonify({'message': 'Utilisateur ajouté avec succès'}), 201

    except Exception as e:
        print('Erreur lors de l\'ajout de l\'utilisateur:', str(e))
        return jsonify({'error': str(e)}), 500



    
    
    
# route pour récupérer un utilisateur avvec l'id de la formation 
@user_bp.route('/getIdFormationByUser', methods=['GET'])
def getIdFormationByUser():
    id_gerant = request.args.get('userId')

    if not id_gerant:
        return jsonify({'error': 'id_gerant parameter is required'}), 400

    try:
        with mysql.connection.cursor() as cur:
            query = """
            SELECT a.annee, u.id_user, u.nom, u.prenom, u.email, u.role, u.password
            FROM formation f
            JOIN annees a ON f.id_formation = a.id_formation
            LEFT JOIN utilisateurs u ON a.id_annee = u.id_annee AND u.role = 'apprenti' AND u.id_gerant = %s
            WHERE f.id_gerant_formation = %s;
            """
            cur.execute(query, (id_gerant,id_gerant))
            result = cur.fetchall()

            if result:
                return jsonify(result), 200
            else:
                return jsonify({'error': 'Aucune donnée trouvée pour ce gérant'}), 404

    # except pymysql.MySQLError as e:
    #     return jsonify({'error': f'Erreur MySQL : {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
    
# Route pour supprimer un utilisateur
@user_bp.route('/deleteUser', methods=['DELETE'])

def delete_user():
    user_id = request.args.get('user_id')
    print(user_id)
    try:
        if not user_id:
            return jsonify({'error': 'Identifiant utilisateur invalide'}), 400

        with mysql.connection.cursor() as cur:
            cur.execute("DELETE FROM utilisateurs WHERE id_user = %s", (user_id,))
            mysql.connection.commit()

            if cur.rowcount > 0:
                return jsonify({'message': 'Utilisateur supprimé avec succès'}), 200
            else:
                return jsonify({'error': 'Utilisateur non trouvé'}), 404

    except mysql.Error as e:
        return jsonify({'error': f'Erreur MySQL : {str(e)}'}), 500
    except Exception as e:
        return jsonify({'error': str(e)}), 50


# route pour modifier un utilisateur
@user_bp.route('/updateUser', methods=['PUT'])
def update_user():
    user_id = request.args.get('user_id')
    print(user_id)
    
    
    try:
        data = request.get_json()
        print("Données reçues :", data)

        nom = data.get('nom')
        prenom = data.get('prenom')
        role = data.get('role')
        email = data.get('email')
        password = data.get('password')

        if not nom or not prenom or not role or not email:
            print('Tous les champs requis ne sont pas fournis')
            return jsonify({'error': 'Tous les champs sont requis'}), 400

        cur = mysql.connection.cursor()

        if password:
            hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')
            sql_query = "UPDATE utilisateurs SET nom=%s, prenom=%s, role=%s, email=%s, password=%s WHERE id_user=%s"
            cur.execute(sql_query, (nom, prenom, role, email, hashed_password, user_id))
        else:
            sql_query = "UPDATE utilisateurs SET nom=%s, prenom=%s, role=%s, email=%s WHERE id_user=%s"
            cur.execute(sql_query, (nom, prenom, role, email, user_id))
        
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Utilisateur mis à jour avec succès'}), 200

    
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500


