from flask import Flask
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import logging
from logging.handlers import RotatingFileHandler
from db import init_db, mysql
from auth_routes import auth_bp
from user_routes import user_bp
from livret_routes import livret_bp
from formation_routes import formation_bp
import secrets

from logging.handlers import RotatingFileHandler
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:5173"}})





# Générer une clé secrète de 32 octets (256 bits)
secret_key = secrets.token_hex(32)
app.config['JWT_SECRET_KEY'] = secret_key
# app.config['SECRET_KEY'] = secret_key #pour URLSafeTimedSerializer

# Initialiser la base de données
init_db(app)

# Initialiser JWT
jwt = JWTManager(app)

# Enregistrer les blueprints
app.register_blueprint(auth_bp, url_prefix='/auth')
app.register_blueprint(user_bp, url_prefix='/user')
app.register_blueprint(livret_bp, url_prefix='/livret')
app.register_blueprint(formation_bp, url_prefix='/formation')


# Configuration du logger pour capturer plus de détails
if not app.debug:
    file_handler = RotatingFileHandler('error.log', maxBytes=10240, backupCount=10)
    file_handler.setLevel(logging.DEBUG)
    file_handler.setFormatter(logging.Formatter(
        '%(asctime)s %(levelname)s: %(message)s [in %(pathname)s:%(lineno)d]'
    ))
    app.logger.addHandler(file_handler)

if __name__ == '__main__':
    app.run(debug=True, port=5000)


