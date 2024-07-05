from flask import Blueprint, request, jsonify, url_for, current_app, redirect
from flask_bcrypt import Bcrypt
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from db import mysql
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from itsdangerous import URLSafeTimedSerializer, SignatureExpired, BadTimeSignature

bcrypt = Bcrypt()
auth_bp = Blueprint('auth', __name__)

def get_serializer():
    return URLSafeTimedSerializer(current_app.config['JWT_SECRET_KEY'])




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
            return jsonify({
                'access_token': access_token,
                'role': user['role'],
                'id_user': user['id_user'],
                'est_valide': user['est_valide']
            }), 200
        else:
            return jsonify({'error': 'Invalid credentials'}), 401

    except Exception as e:
        current_app.logger.error(f'Error during login: {str(e)}')
        return jsonify({'error': str(e)}), 500



@auth_bp.route('/verify-user', methods=['GET'])
@jwt_required()
def verify_user():
    user_id = get_jwt_identity()
    role_user = get_user_role_from_database(user_id)
    return jsonify({'id': user_id, 'role': role_user})

def get_user_role_from_database(user_id):
    try:
        cur = mysql.connection.cursor()
        cur.execute("SELECT role FROM utilisateurs WHERE id_user = %s", (user_id,))
        result = cur.fetchone()
        cur.close()

        if result:
            return result['role']
        else:
            return None
    except Exception as e:
        print(f"Erreur lors de la récupération du rôle de l'utilisateur: {str(e)}")
        return None


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
        current_app.logger.error(f'Error during user validation: {str(e)}')
        return jsonify({'error': str(e)}), 500
    
    
      
@auth_bp.route('/reset-password-request', methods=['POST'])
def reset_password_request():
    try:
        data = request.get_json()
        email = data.get('email')

        if not email:
            current_app.logger.debug('Email requis non fourni')
            return jsonify({'error': 'Email requis'}), 400

        cur = mysql.connection.cursor()
        cur.execute("SELECT * FROM utilisateurs WHERE email = %s", (email,))
        user = cur.fetchone()
        cur.close()

        if user is None:
            current_app.logger.debug('Email non trouvé dans la base')
            return jsonify({"error": "Email non trouvé"}), 404

        s = get_serializer()
        token = s.dumps(email, salt='email-reset')
        current_app.logger.debug(f'Token généré: {token}')

        msg = MIMEMultipart()
        msg['From'] = 'laibhossame1@gmail.com'
        msg['To'] = email
        msg['Subject'] = 'Demande de réinitialisation de mot de passe'
        link = f'http://localhost:5173/reset-password?token={token}'
        current_app.logger.debug(f'Lien de réinitialisation de mot de passe: {link}')

        msg.attach(MIMEText(f'Votre lien de réinitialisation est {link}', 'plain'))

        try:
            with smtplib.SMTP('smtp.gmail.com', 587) as server:
                server.starttls()
                server.login('laibhossame1@gmail.com', 'qamsjxnnjhkhlvkj')
                server.sendmail(msg['From'], msg['To'], msg.as_string())
            current_app.logger.debug('Email envoyé avec succès')
        except smtplib.SMTPException as smtp_error:
            current_app.logger.error(f'Erreur SMTP: {str(smtp_error)}')
            return jsonify({'error': 'Échec de l\'envoi de l\'email'}), 500

        return jsonify({"message": "Un email a été envoyé pour réinitialiser votre mot de passe"}), 200

    except Exception as e:
        current_app.logger.error(f'Erreur lors de la demande de réinitialisation de mot de passe: {str(e)}')
        return jsonify({'error': str(e)}), 500



@auth_bp.route('/reset-password/<token>', methods=['GET', 'POST'])
def reset_password(token):
    if request.method == 'GET':
        return redirect(f'http://localhost:5173/reset-password?token={token}')
    
    if request.method == 'POST':
        try:
            s = get_serializer()
            email = s.loads(token, salt='email-reset', max_age=3600)
        except SignatureExpired:
            return jsonify({"error": "Le token a expiré"}), 400
        except BadTimeSignature:
            return jsonify({"error": "Token invalide"}), 400

        try:
            data = request.get_json()
            new_password = data.get('new_password')
            if not new_password:
                current_app.logger.debug('Nouveau mot de passe requis non fourni')
                return jsonify({'error': 'Nouveau mot de passe requis'}), 400

            hashed_password = bcrypt.generate_password_hash(new_password).decode('utf-8')

            cur = mysql.connection.cursor()
            cur.execute("UPDATE utilisateurs SET password = %s WHERE email = %s", (hashed_password, email))
            mysql.connection.commit()
            cur.close()

            current_app.logger.debug('Mot de passe réinitialisé avec succès')
            return jsonify({"message": "Mot de passe réinitialisé avec succès"}), 200

        except Exception as e:
            current_app.logger.error(f'Erreur lors de la réinitialisation du mot de passe: {str(e)}')
            return jsonify({'error': str(e)}), 500