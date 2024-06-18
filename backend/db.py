from flask_mysqldb import MySQL

mysql = MySQL()

def init_db(app):
    app.config['MYSQL_HOST'] = '193.203.168.56'
    app.config['MYSQL_USER'] = 'u115854924_userApp' 
    app.config['MYSQL_PASSWORD'] = 'Ep12345!'  
    app.config['MYSQL_DB'] = 'u115854924_bdd_livret_app' 
    app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
    mysql.init_app(app)
