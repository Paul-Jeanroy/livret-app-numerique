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

    print("userid : ", user_id)

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

        # Debug: Affichage des données reçues
        print(f"Nouvel utilisateur à envoyer : {data}")

        if not nom or not prenom or not role or not email or not password:
            return jsonify({'error': 'Tous les champs sont requis'}), 400

        hashed_password = bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

        cur = mysql.connection.cursor()

        # Debug: Affichage de la requête SQL
        sql_query = "INSERT INTO utilisateurs (nom, prenom, password, role, email) VALUES (%s, %s, %s, %s, %s)"
        print(f"Executing SQL query: {sql_query} with values ({nom}, {prenom}, {hashed_password}, {role}, {email})")

        cur.execute(sql_query, (nom, prenom, hashed_password, role, email))
        mysql.connection.commit()
        cur.close()

        # Debug: Succès de l'ajout d'utilisateur
        print("Utilisateur ajouté avec succès")

        return jsonify({'message': 'Utilisateur ajouté avec succès'}), 201

    except Exception as e:
        # Debug: Affichage de l'erreur
        print(f"Erreur lors de l'ajout de l'utilisateur : {str(e)}")
        return jsonify({'error': str(e)}), 500