from flask_mysqldb import MySQL

mysql = MySQL()

def init_db(app):
    app.config['MYSQL_HOST'] = 'localhost'
    app.config['MYSQL_USER'] = 'root' 
    app.config['MYSQL_PASSWORD'] = ''  
    app.config['MYSQL_DB'] = 'livret-app-num' 
    app.config['MYSQL_CURSORCLASS'] = 'DictCursor'
    mysql.init_app(app)