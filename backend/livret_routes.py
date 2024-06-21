import os
import requests
from flask import Flask, Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from bs4 import BeautifulSoup
import fitz  # PyMuPDF
import re

app = Flask(__name__)
CORS(app)

livret_bp = Blueprint('livret', __name__)

@livret_bp.route('/getInfoFormation', methods=['GET'])
def get_info_formation():
    try:
        code_rncp = request.args.get('w_codeRncp')
        if not code_rncp:
            return jsonify({'error': 'w_codeRncp parameter is required'}), 400

        url = f"https://www.francecompetences.fr/recherche/rncp/{code_rncp}"

        response = requests.get(url)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        content_to_get = soup.find('main', class_='main')
        if not content_to_get:
            return jsonify({'error': 'Aucun contenu à récupérer'}), 404

        etat_element = content_to_get.find('p', class_='tag--fcpt-certification green')
        etat = etat_element.find('span', class_='tag--fcpt-certification__status font-bold').get_text(strip=True) if etat_element else 'N/A'
        
        if etat and 'Active' in etat:
            code_element = content_to_get.find('span', class_='tag--fcpt-certification__status font-bold')
            titre_element = content_to_get.find('h1', class_='title--page--generic')
            niveau_element = content_to_get.find('span', class_='list--fcpt-certification--essential--desktop__line__text--highlighted')
            
            fichier_pdf_element = None
            for a in content_to_get.find_all('a'):
                if 'Référentiel d’activité, de compétences et d’évaluation' in a.text:
                    fichier_pdf_element = a
                    break
            
            nom_formation = titre_element.get_text(strip=True) if titre_element else 'N/A'
            niveau = niveau_element.get_text(strip=True) if niveau_element else 'N/A'
            fichier_pdf = fichier_pdf_element['href'] if fichier_pdf_element else 'N/A'
            code = code_element.get_text(strip=True) if code_element else 'N/A'

            return jsonify({
                'nom': nom_formation,
                "niveau": niveau,
                "code": code,
                "fichier_pdf": fichier_pdf,
                "etat": etat
            })

        else:
            return jsonify({'error': 'Formation non active'}), 404

    except Exception as e:
        return jsonify({'error': str(e), 'details': repr(e)}), 500





# @livret_bp.route('/setInfoFormation', methods=['POST'])
# def set_info_formation():
#     try:
#         data = request.get_json()
#         nom_formation = data.get('nom')
#         code = data.get('code')
#         niveau = data.get('niveau')

#         if not nom_formation or not niveau or not code:
#             return jsonify({'error': 'Il manque des arguements'}), 400

#         cur = mysql.connection.cursor()
#         sql_query = "INSERT INTO formation (nom_formation, code, niveau) VALUES (%s, %s, %s)"
#         cur.execute(sql_query, (nom_formation, code, niveau))
#         mysql.connection.commit()
#         cur.close()

#         return jsonify({'message': 'Formation enregistrées avec succès'}), 200

#     except Exception as e:
#         return jsonify({'error': str(e), 'details': repr(e)}), 500





if __name__ == '__main__':
    app.run(debug=True)
