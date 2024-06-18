import requests
from bs4 import BeautifulSoup
from flask import Blueprint, jsonify, request

livret_bp = Blueprint('livret', __name__)

@livret_bp.route('/getInfoFormation', methods=['GET'])
def get_info_formation():
    try:
        code_rncp = request.args.get('w_codeRncp')
        if not code_rncp:
            return jsonify({'error': 'w_codeRncp parameter is required'}), 400

        url = "https://www.francecompetences.fr/recherche/rncp/" + code_rncp

        response = requests.get(url)
        response.raise_for_status()

        soup = BeautifulSoup(response.text, 'html.parser')

        content_to_get = soup.find('div', class_='accordion-content--fcpt-certification--skills')
        if not content_to_get:
            return jsonify({'error': 'Aucun contenu à récupérer'}), 404

        titre_bloc = [titre.get_text(strip=True) for titre in content_to_get.find_all('p', class_='text--fcpt-certification__title')]

        tables = content_to_get.find_all('table', class_='table--fcpt-certification')
        compétences = [table.find('td', class_='table--fcpt-certification__body__cell').get_text(strip=True) for table in tables]

        return jsonify({
            'titres bloc': titre_bloc,
            'compétences': compétences
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500
