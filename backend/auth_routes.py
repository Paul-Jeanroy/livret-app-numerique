from flask import Blueprint, request, jsonify
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token
from db import mysql

bcrypt = Bcrypt()
auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/login', methods=['POST'])
def login():
    try:
        data = request.get_json()
        email = data.get('email')
        password = data.get('password')

        if not email or not password:
            return jsonify({'error': 'Email ou password requis'}), 400

        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM utilisateurs WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()

        if user and bcrypt.check_password_hash(user['password'], password):
            access_token = create_access_token(identity=user['id_user'])
            role = user['role']
            id_user = user['id_user']
            est_valide = user['est_valide']
            return jsonify({'access_token': access_token, 'role': role, 'id_user': id_user, 'est_valide': est_valide}), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        return jsonify({'error': str(e)}), 500

@auth_bp.route('/validationUser', methods=['POST'])
def validation_user():
    try:
        data = request.get_json()
        user_id = data.get('user_id')
        password = data.get('password')

        if not user_id or not password:
            return jsonify({'error': "L'id de l'utilisateur et le nouveau mot de passe sont obligatoires"}), 400

        hashed_password = bcrypt.generate_password_hash(password).decode('utf-8')

        cur = mysql.connection.cursor()
        cur.execute("UPDATE utilisateurs SET est_valide = %s, password = %s WHERE id_user = %s", (1, hashed_password, user_id))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': "l'utilisateur est validé !"}), 200

    except Exception as e:
        print(f"Erreur: {str(e)}")
        return jsonify({'error': str(e)}), 500
