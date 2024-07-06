import os
from flask_mysqldb import MySQL
from dotenv import load_dotenv

mysql = MySQL()

def init_db(app):
    load_dotenv()

    app.config['MYSQL_HOST'] = os.getenv('MYSQL_HOST')
    app.config['MYSQL_USER'] = os.getenv('MYSQL_USER')
    app.config['MYSQL_PASSWORD'] = os.getenv('MYSQL_PASSWORD')
    app.config['MYSQL_DB'] = os.getenv('MYSQL_DB')
    app.config['MYSQL_CURSORCLASS'] = os.getenv('MYSQL_CURSORCLASS')
    
    mysql.init_app(app)
