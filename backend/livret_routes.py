from flask import Flask, Blueprint, jsonify, request
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from flask_mysqldb import MySQL
import pdfplumber
import tempfile
from bs4 import BeautifulSoup
import openai
from dotenv import load_dotenv
import os
import re
import json
from db import mysql


# Load environment variables from .env file
load_dotenv()

# Retrieve the API key from environment variables
api_key = os.getenv("OPENAI_API_KEY")

# Raise an error if the API key is not set
if api_key is None:
    raise ValueError("The OPENAI_API_KEY environment variable is not set.")

# Initialize the OpenAI API key
openai.api_key = api_key

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
        # Récupération du lien du PDF
        pdf_url = request.args.get('pdf_path')
        
        # Télécharger le PDF
        response = requests.get(pdf_url)
        response.raise_for_status()
        
        # Enregistrer le PDF dans un fichier temporaire
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp_file:
            tmp_file.write(response.content)
            tmp_file_path = tmp_file.name
        
        # Initialisation des variables
        blocs_competences = {}
        current_bloc = None
        competence_buffer = ""

        # Définir une expression régulière pour détecter les débuts de compétences
        competence_pattern = re.compile(r'^C\d+[a-zA-Z]?')

        # Ouvrir le fichier PDF avec pdfplumber
        with pdfplumber.open(tmp_file_path) as pdf:
            for page in pdf.pages:
                table = page.extract_table()

                if table:
                    for row in table:
                        bloc = row[0]  # Première colonne concerne les blocs
                        competence = row[1]  # Deuxième colonne concerne les compétences

                        # Vérification s'il y a des blocs
                        if bloc and (bloc.startswith("BLOC") or bloc.startswith("Bloc")):
                            # Sauvegarder la compétence accumulée avant de changer de bloc
                            if competence_buffer.strip() and current_bloc:
                                blocs_competences[current_bloc]["competences"].append(competence_buffer.strip())
                                competence_buffer = ""

                            current_bloc = " ".join(bloc.strip().split())
                            if current_bloc not in blocs_competences:
                                blocs_competences[current_bloc] = {"bloc": "", "competences": []}
                            blocs_competences[current_bloc]["bloc"] += " " + bloc.strip()

                        # Récupération des compétences dans le texte extrait
                        if competence and current_bloc:
                            parts = re.split(r'(?=C\d+[a-zA-Z]?)', competence)
                            for part in parts:
                                if competence_pattern.match(part.strip()):
                                    if competence_buffer.strip():
                                        blocs_competences[current_bloc]["competences"].append(competence_buffer.strip())
                                    competence_buffer = part.strip()
                                else:
                                    competence_buffer += " " + part.strip()

        # Ajouter la dernière compétence si elle existe
        if competence_buffer.strip() and current_bloc:
            blocs_competences[current_bloc]["competences"].append(competence_buffer.strip())

        # Supprimer le fichier temporaire après traitement
        os.remove(tmp_file_path)
        
        # Nettoyer les données pour enlever les doublons
        for bloc in blocs_competences:
            blocs_competences[bloc]["competences"] = sorted(list(set(blocs_competences[bloc]["competences"])))
            blocs_competences[bloc]["bloc"] = blocs_competences[bloc]["bloc"].strip()

        # Retourner au frontend en format JSON le tableau de blocs et compétences
        return jsonify(blocs_competences)
    
    # Gestion des erreurs avec un retour format JSON
    except Exception as e:
        return jsonify({'error': str(e), 'details': repr(e)}), 500



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

        # Only test with the first competence
        competence = competences[0]
        print(f"Appel à l'API OpenAI pour la compétence : {competence}")
        response = openai.ChatCompletion.create(
            model="gpt-3.5-turbo",
            messages=[
                {"role": "system", "content": "You are a helpful assistant."},
                {"role": "user", "content": f"Raccourcissez cette compétence : {competence}"}
            ],
            max_tokens=50
        )
        shortened_competence = response.choices[0].message['content'].strip()
        print(f"Compétence raccourcie : {shortened_competence}")
        shortened_competences.append({
            "original": competence,
            "raccourcie": shortened_competence
        })
        
        return jsonify({'shortened_competences': shortened_competences})
    
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e), 'details': repr(e)}), 500



@livret_bp.route('/saveEvaluation', methods=['POST'])
def save_evaluation():
    try:
        data = request.get_json()
        maitre_id = data['userId']
        formation_id = data['formationId']
        evaluations = data['evaluations']
        apprenti_id = data['apprentiId']
        mission = data['mission']
        remarque = data.get('remarque', None)
        periode = data['periode']

        cur = mysql.connection.cursor()

        # Insérer les informations générales et les évaluations dans livret_maitre_apprentissage
        query_livret = """
            INSERT INTO livret_maitre_apprentissage (id_maitre_apprentissage, id_formation, id_apprenti, mission, remarque, periode, evaluation)
            VALUES (%s, %s, %s, %s, %s, %s, %s)
        """
        cur.execute(query_livret, (
            maitre_id, formation_id, apprenti_id, mission, remarque, periode, 
            json.dumps(evaluations)  # Convertir les évaluations en JSON
        ))

        mysql.connection.commit()
        cur.close()
        return jsonify({'message': 'Evaluations saved successfully'}), 200
    except Exception as e:
        # Debug log for the exception
        print(f"Error saving evaluations: {str(e)}")
        return jsonify({'error': str(e)}), 500



@livret_bp.route('/getFormationInfo', methods=['GET'])
def get_formation_info():
    try:
        apprenti_id = request.args.get('apprentiId')
        cur = mysql.connection.cursor()

        # Get the formation details
        query_formation = """
            SELECT f.*, COUNT(a.id_annee) AS duree
            FROM formation f
            JOIN utilisateurs u ON f.id_formation = u.id_formation
            JOIN annees a ON f.id_formation = a.id_formation
            WHERE u.id_user = %s
        """
        cur.execute(query_formation, (apprenti_id,))
        formation_info = cur.fetchone()
        cur.close()

        if not formation_info:
            return jsonify({'error': 'Formation not found'}), 404

        return jsonify(formation_info), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500




@livret_bp.route('/updateEvaluation/<int:id>', methods=['PUT'])
def update_evaluation(id):
    try:
        data = request.json
        if not data:
            return jsonify({'error': "Les données sont nécessaires pour la mise à jour."}), 400

        cur = mysql.connection.cursor()
        query = """
            UPDATE livret_maitre_apprentissage
            SET evaluation = %s, mission = %s, remarque = %s
            WHERE id_livret = %s
        """
        cur.execute(query, (
            json.dumps(data['evaluations']), 
            data['mission'], 
            data['remarque'], 
            id
        ))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Livret mis à jour avec succès.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500






@livret_bp.route('/getApprentis', methods=['GET'])
def get_apprentis():
    try:
        maitre_id = request.args.get('maitreId')
        cur = mysql.connection.cursor()
        query = """
            SELECT u.id_user, u.nom, u.prenom
            FROM utilisateurs u
            JOIN supervisions s ON u.id_user = s.id_apprenti
            WHERE s.id_maitre_apprentissage = %s
        """
        cur.execute(query, (maitre_id,))
        apprentis = cur.fetchall()
        cur.close()
        return jsonify({"apprentis": apprentis}), 200
    except Exception as e:
        print(f"Error fetching apprentis: {str(e)}")
        return jsonify({'error': str(e)}), 500





@livret_bp.route('/checkPeriodeCompletion', methods=['GET'])
def check_periode_completion():
    try:
        formation_id = request.args.get('formation_id')
        apprenti_id = request.args.get('apprenti_id')
        periode = request.args.get('periode')

        if not formation_id or not apprenti_id or not periode:
            return jsonify({'error': "Les paramètres 'formation_id', 'apprenti_id' et 'periode' sont nécessaires."}), 400

        cur = mysql.connection.cursor()
        query = """
            SELECT *
            FROM livret_maitre_apprentissage
            WHERE id_formation = %s AND id_apprenti = %s AND periode = %s
        """
        cur.execute(query, (formation_id, apprenti_id, periode))
        result = cur.fetchone()
        cur.close()

        if not result:
            return jsonify({'completed': False}), 200

        return jsonify({'completed': result}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    


@livret_bp.route('/setLivretApprenti', methods=['POST'])
def set_periode_livret():
    try:
        data = request.json
        apprenti_id = data.get('apprentiId')
        periode = data.get('periode')
        formation_id = data.get('formationId')
        modules = data.get('modules')

        if not modules or not apprenti_id or not periode or not formation_id:
            return jsonify({'error': "Veuillez remplir au moins un modules"}), 400

        cur = mysql.connection.cursor()

        # Récupérer le maitre_id à partir de l'apprenti_id
        cur.execute("SELECT id_maitre_apprentissage FROM supervisions WHERE id_apprenti = %s", (apprenti_id,))
        result = cur.fetchone()

        if not result:
            return jsonify({'error': "Maitre d'apprentissage introuvable pour l'apprenti donné"}), 400

        maitre_id = result['id_maitre_apprentissage']

        # Vérifier si une entrée existe déjà pour cette période et cet apprenti
        check_query = """
            SELECT id_livret FROM livret_apprenti 
            WHERE id_apprenti = %s AND id_formation = %s AND periode = %s
        """
        cur.execute(check_query, (apprenti_id, formation_id, periode))
        existing_entry = cur.fetchone()

        if existing_entry:
            # Mettre à jour l'entrée existante
            update_query = """
                UPDATE livret_apprenti 
                SET modules = %s
                WHERE id_livret = %s
            """
            cur.execute(update_query, (json.dumps(modules), existing_entry['id_livret']))
        else:
            # Insérer une nouvelle entrée
            insert_query = """
                INSERT INTO livret_apprenti (id_apprenti, id_maitre_apprentissage, id_formation, periode, modules) 
                VALUES (%s, %s, %s, %s, %s)
            """
            cur.execute(insert_query, (apprenti_id, maitre_id, formation_id, periode, json.dumps(modules)))

        mysql.connection.commit()
        cur.close()

        return jsonify({'success': True}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



 
 
 

@livret_bp.route('/getLivretApprenti', methods=['GET'])
def get_periode_livret():
    try:
        apprenti_id = request.args.get('apprentiId')
        periode = request.args.get('periode')
        formation_id = request.args.get('formationId')

        if not apprenti_id or not periode or not formation_id:
            return jsonify({'error': "Les paramètres 'apprentiId', 'periode' et 'formationId' sont nécessaires."}), 400

        cur = mysql.connection.cursor()
        query = """
            SELECT modules
            FROM livret_apprenti
            WHERE id_apprenti = %s AND id_formation = %s AND periode = %s
        """
        cur.execute(query, (apprenti_id, formation_id, periode))
        result = cur.fetchone()
        cur.close()

        if result:
            return jsonify({'modules': json.loads(result['modules'])}), 200
        else:
            return jsonify({'modules': []}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    

app.register_blueprint(livret_bp, url_prefix='/livret')

if __name__ == '__main__':
    app.run(debug=True)
