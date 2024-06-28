import os
import requests
from flask import Flask, Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
import pdfplumber
import tempfile
from bs4 import BeautifulSoup
from dotenv import load_dotenv
from openai import OpenAI


client = OpenAI()
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


@livret_bp.route('/getBlocCompetencesFromPDF', methods=['GET'])
def get_bloc_competence_from_pdf():
    try:
        # Récupération du liens du pdf
        pdf_url = request.args.get('pdf_path')
        
        # Télécharger le PDF
        response = requests.get(pdf_url)
        response.raise_for_status()
        
        # Enregistrer le PDF dans un fichier temporaire
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            tmp_file.write(response.content)
            tmp_file_path = tmp_file.name
        
        # Iniatilisation des variables
        blocs_competences = {}
        current_bloc = None
        bloc_text = ""
        capture_bloc_text = False

        # Ouvrir le fichier PDF avec pdfplumber
        with pdfplumber.open(tmp_file_path) as pdf:
            for page in pdf.pages:
                table = page.extract_table()

                if table:
                    for row in table:
                        bloc = row[0]  # Première colonne concerne les blocs
                        competence = row[1]  # Deuxième colonne concerne les compétences

                        # Vérification si il y a des blocs
                        if bloc and bloc.startswith("BLOC"):
                            current_bloc = " ".join(bloc.strip().split())
                            if current_bloc not in blocs_competences:
                                blocs_competences[current_bloc] = {"bloc": "", "competences": []}
                            capture_bloc_text = True
                            bloc_text = bloc.strip()
                            blocs_competences[current_bloc]["bloc"] += " " + bloc_text
                        elif capture_bloc_text and bloc and bloc.startswith("A"):
                            capture_bloc_text = False

                        # Récupération des compétences dans le texte extrait
                        if competence and current_bloc:
                            competencies = [c.strip() for c in competence.split("C") if c.strip()]
                            for c in competencies:
                                if c and c[0].isdigit(): # si le bloc de compétence commence par "A suivi dun nombre..."
                                    blocs_competences[current_bloc]["competences"].append("C" + c)
        
        
        # Supprime le fichier temporaire après traitement
        os.remove(tmp_file_path)
        
        # Retirer les bloc depubliqués
        for bloc in blocs_competences:
            blocs_competences[bloc]["competences"] = list(set(blocs_competences[bloc]["competences"]))
            blocs_competences[bloc]["bloc"] = blocs_competences[bloc]["bloc"].strip()

        # Retrourner au frontend en format json le tableau de blocs et compétences
        return jsonify(blocs_competences)
    
    # Gestion des erreurs avec un retour format json
    except Exception as e:
        return jsonify({'error': str(e), 'details': repr(e)}), 500

app.register_blueprint(livret_bp, url_prefix='/livret')

load_dotenv()

# clé API OpenAI
openai.api_key = os.getenv('OPENAI_API_KEY')

@livret_bp.route('/raccourcie-comp-ai', methods=['POST'])
def raccourcir_competence():
    try:
        print("Requête reçue pour raccourcir les compétences")
        data = request.json
        if not data:
            raise ValueError("Aucune donnée reçue")
        print("Données reçues :", data)
        competences = data.get('competences', [])
        if not competences:
            raise ValueError("Aucune compétence reçue")
        print("Compétences à raccourcir :", competences)
        shortened_competences = []

        for competence in competences:
            print(f"Appel à l'API OpenAI pour la compétence : {competence}")
            response = openai.Completion.create(
                engine="text-davinci-003",
                prompt=f"Raccourcissez cette compétence : {competence}",
                max_tokens=50
            )
            shortened_competence = response.choices[0].text.strip()
            print(f"Compétence raccourcie : {shortened_competence}")
            shortened_competences.append({
                "original": competence,
                "raccourcie": shortened_competence
            })
        
        return jsonify({'shortened_competences': shortened_competences})
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e), 'details': repr(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
    
    
