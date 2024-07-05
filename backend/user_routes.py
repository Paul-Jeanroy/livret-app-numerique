from flask import Flask
from flask import Blueprint, jsonify, request
from flask_jwt_extended import jwt_required, get_jwt_identity
from db import mysql
import bcrypt
import pandas as pd
import io

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
        print("data", data)
        nom = data.get('w_nom')
        print("nom", nom)
        prenom = data.get('w_prenom')
        role = data.get('w_role')
        email = data.get('w_email')
        password = data.get('w_password')
        id_gerant = data.get('userId')
        annee = data.get('annee')
        est_valide = 0

        if not nom or not prenom or not role or not email or not password or not annee:
            return jsonify({'error': 'Tous les champs sont requis'}), 400

        cur = mysql.connection.cursor()

        cur.execute("SELECT id_formation FROM formation WHERE id_gerant_formation = %s", (id_gerant,))
        id_formation = cur.fetchone()
        if not id_formation:
            return jsonify({'error': "L'utilisateur n'est gérant d'aucune formation"}), 400
        id_formation = id_formation['id_formation']
        
        cur.execute("SELECT id_annee FROM annees WHERE id_formation = %s AND annee = %s", (id_formation, annee,))
        id_annee = cur.fetchone()
        if not id_annee:
            return jsonify({'error': "L'année spécifiée n'existe pas"}), 400
        id_annee = id_annee['id_annee']

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        sql_query = "INSERT INTO utilisateurs (nom, prenom, password, role, email, id_gerant, id_annee, id_formation, est_valide) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
        cur.execute(sql_query, (nom, prenom, hashed_password, role, email, id_gerant, int(id_annee), int(id_formation), est_valide))
        mysql.connection.commit()
        cur.close()

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
            cur.execute(query, (id_gerant, id_gerant))
            result = cur.fetchall()

            if result:
                return jsonify(result), 200
            else:
                return jsonify([]), 200

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
@user_bp.route('/setUpdateUser', methods=['PUT'])
def update_user():
    user_id = request.args.get('user_id')

    try:
        data = request.get_json()

        nom = data.get('nom')
        prenom = data.get('prenom')
        role = data.get('role')
        email = data.get('email')
        password = data.get('password')

        if not nom or not prenom or not role or not email:
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
    
    
    
    
    

@user_bp.route('/updateProfile', methods=['PUT'])
@jwt_required()
def update_profile():
    user_id = get_jwt_identity()

    try:
        data = request.get_json()

        nom = data.get('nom')
        prenom = data.get('prenom')
        role = data.get('role')
        email = data.get('email')
        password = data.get('password')

        if not nom or not prenom or not role or not email:
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

        return jsonify({'message': 'Profil utilisateur mis à jour avec succès'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@user_bp.route('/getInfoFormationByUserIdMa', methods=['GET'])
def get_info_formation_by_user_idMa():
    user_id = request.args.get('user_id')

    try:
        with mysql.connection.cursor() as cur:
            query_apprentis = """
                SELECT id_apprenti
                FROM supervisions
                WHERE id_maitre_apprentissage = %s;
            """
            cur.execute(query_apprentis, (user_id,))
            apprentis_results = cur.fetchall()

            if not apprentis_results:
                return jsonify({'error': 'Aucun apprenti supervisé trouvé pour ce maître d\'apprentissage'}), 404

            formations = []
            for apprenti in apprentis_results:
                apprenti_id = apprenti['id_apprenti']
                query_formation = """
                    SELECT f.*
                    FROM formation f
                    JOIN utilisateurs u ON f.id_formation = u.id_formation
                    WHERE u.id_user = %s;
                """
                cur.execute(query_formation, (apprenti_id,))
                formation_result = cur.fetchone()
                if formation_result:
                    formations.append(formation_result)

            response = {
                'formation': formations
            }

            return jsonify(response), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@user_bp.route('/getInfoFormationByUserIdApprenti', methods=['GET'])
def get_info_formation_by_user_idApprenti():
    user_id = request.args.get('user_id')

    try:
        with mysql.connection.cursor() as cur:
            query_formation = """
                SELECT f.*
                FROM formation f
                JOIN utilisateurs u ON f.id_formation = u.id_formation
                WHERE u.id_user = %s;
            """
            cur.execute(query_formation, (user_id,))
            formation_result = cur.fetchone()
            if formation_result:
                return jsonify(formation_result), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500
    

#importUser

@user_bp.route('/importUsers', methods=['POST'])
@jwt_required()
def import_users():
    if 'file' not in request.files:
        return jsonify({'error': 'Aucun fichier fourni'}), 400

    file = request.files['file']

    if file.filename == '':
        return jsonify({'error': 'Aucun fichier sélectionné'}), 400

    if file and file.filename.endswith('.csv'):
        try:
            data = pd.read_csv(io.StringIO(file.stream.read().decode('utf-8')))
            print("Données CSV analysées:", data)

            user_id = get_jwt_identity()

            for index, row in data.iterrows():
                nom = row['nom']
                prenom = row['prenom']
                role = row['role']
                email = row['email']
                password = row['password']
                annee = row['annee']
                est_valide = 0

                if not nom or not prenom or not role or not email or not password or not annee:
                    print("Entrée invalide, utilisateur ignoré.")
                    continue

                cur = mysql.connection.cursor()

                cur.execute("SELECT id_formation FROM formation WHERE id_gerant_formation = %s", (user_id,))
                id_formation = cur.fetchone()
                if not id_formation:
                    print(f"Aucune formation trouvée pour l'utilisateur ID {user_id}")
                    continue
                id_formation = id_formation['id_formation']

                cur.execute("SELECT id_annee FROM annees WHERE id_formation = %s AND annee = %s", (id_formation, annee))
                id_annee = cur.fetchone()
                if not id_annee:
                    print(f"Aucune année trouvée pour la formation ID {id_formation} et l'année {annee}")
                    continue
                id_annee = id_annee['id_annee']

                hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

                sql_query = "INSERT INTO utilisateurs (nom, prenom, password, role, email, id_gerant, id_annee, id_formation, est_valide) VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)"
                cur.execute(sql_query, (nom, prenom, hashed_password, role, email, user_id, int(id_annee), int(id_formation), est_valide))

                mysql.connection.commit()
                cur.close()

            print("Importation réussie")
            return jsonify({'message': 'Utilisateurs importés avec succès'}), 201

        except Exception as e:
            print("Erreur lors de l'importation des utilisateurs:", str(e))
            return jsonify({'error': str(e)}), 500
    else:
        return jsonify({'error': 'Format de fichier non supporté, veuillez télécharger un fichier CSV'}), 400
