from flask import Flask, Blueprint, jsonify, request
from flask_mysqldb import MySQL
import mysql
from db import mysql
import json
import re

formation_bp = Blueprint('formation', __name__)



@formation_bp.route('/setFormation', methods=['POST'])
def set_formation_bdd():
    id_gerant_formation = request.args.get('user_id')

    if not id_gerant_formation:
        return jsonify({'error': 'ID utilisateur manquant'}), 400

    try:
        data = request.get_json()
        nom = data.get('nom')   
        code = data.get('code')
        niveau = data.get('niveau')
        periode_defaut = "Trimestre"

        if not nom or not code or not niveau:
            return jsonify({'error': "Données manquantes pour l'ajout de cette formation en base"}), 400

        cur = mysql.connection.cursor()
        cur.execute("INSERT INTO formation (nom, code_rncp, niveau, id_gerant_formation, periode) VALUES (%s, %s, %s, %s, %s)", 
                    (nom, code, niveau, id_gerant_formation, periode_defaut))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Formation ajoutée avec succès'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
    
    
    
@formation_bp.route('/setAnneOnFormation', methods=['POST'])
def set_anne_on_formation():
    id_gerant_formation = request.args.get('user_id')
    try:
        data = request.get_json()
        nom = data.get('w_nom')

        if not id_gerant_formation or not nom:
            return jsonify({'error': "Données manquantes pour l'ajout de l'année de cette formation en base"}), 400

        cur = mysql.connection.cursor()

        query = "SELECT id_formation FROM formation WHERE id_gerant_formation = %s"
        cur.execute(query, (id_gerant_formation,))
        result = cur.fetchone()

        if not result:
            return jsonify({'error': 'Aucune formation trouvée pour ce coordinateur de filière'}), 404

        id_formation = result['id_formation']

        query = "INSERT INTO annees (id_formation, annee) VALUES (%s, %s)"
        cur.execute(query, (id_formation, nom))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Année de formation ajoutée avec succès'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    


@formation_bp.route('/setBlocCompFormation', methods=['POST'])
def set_bloc_comp_formation():
    try:
        request_data = request.get_json()
        data = request_data.get('data')
        user_id = request_data.get('user_id')

        if not data or not user_id:
            return jsonify({'error': 'Données manquantes'}), 400

        cur = mysql.connection.cursor()

        # Récupérer l'id_formation à partir de user_id
        query = """
        SELECT id_formation 
        FROM formation 
        WHERE id_gerant_formation = %s
        """
        cur.execute(query, (user_id,))
        result = cur.fetchone()
        print("Résultat de la requête:", result)

        if not result:
            return jsonify({'error': 'Aucune formation trouvée pour cet utilisateur'}), 404

        id_formation = result['id_formation']

        # Fonction pour extraire le titre et la description d'un bloc
        def extract_bloc_info(blocText):
            title_match = re.search(r'(BLOC|Bloc) \d+', blocText)
            if title_match:
                title = title_match.group(0)
            else:
                title = blocText.split()[0]

            desc_match = re.search(r'(A\d+)', blocText)
            if desc_match:
                description = blocText.split(desc_match.group(0))[0].strip()
            else:
                description = blocText 
            
            return title, description

        # Parcourir chaque bloc et insérer dans la table bloc_de_competences
        for blocTitle, blocData in data.items():
            nom_bloc, description_bloc = extract_bloc_info(blocData['bloc'])
            cur.execute("INSERT INTO bloc_de_competences (nom, description, id_formation) VALUES (%s, %s, %s)", 
                        (nom_bloc, description_bloc, id_formation))
            id_bloc = cur.lastrowid
            print(f"Inserted bloc with id: {id_bloc}")

            # Insérer les compétences associées
            for competence in blocData['competences']:
                nom_competence = competence.split(' ')[0]  # Extraire le numéro de la compétence
                description_competence = competence
                cur.execute("INSERT INTO competence (nom, description, id_bloc) VALUES (%s, %s, %s)", 
                            (nom_competence, description_competence, id_bloc))
        
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Blocs et compétences ajoutés avec succès'}), 200
    except Exception as e:
        print(f"Exception: {str(e)}")
        return jsonify({'error': str(e)}), 500
    
    

@formation_bp.route('/getFormationByUserId', methods=['GET'])
def get_formation_by_user_id():
    try:
        user_id = request.args.get('user_id')
        role = request.args.get('role')

        if not user_id or not role:
            return jsonify({'error': 'User ID and role are required'}), 400

        cur = mysql.connection.cursor()

        if role == 'coordinateur':
            query = "SELECT * FROM formation WHERE id_gerant_formation = %s"
            cur.execute(query, (user_id,))
        elif role == 'maître d\'apprentissage':
            query = """
                SELECT f.*
                FROM formation f
                JOIN utilisateurs u ON f.id_formation = u.id_formation
                JOIN supervisions s ON u.id_user = s.id_apprenti
                WHERE s.id_maitre_apprentissage = %s AND u.id_user = %s
            """
            cur.execute(query, (user_id, user_id))
        elif role == 'apprenti':
            query = """
                SELECT f.*
                FROM formation f
                JOIN utilisateurs u ON f.id_formation = u.id_formation
                WHERE u.id_user = %s
            """
            cur.execute(query, (user_id,))
        else:
            return jsonify({'error': 'Invalid role'}), 400

        formation = cur.fetchone()
        cur.close()

        if not formation:
            return jsonify({'error': 'No formation found for this user'}), 404

        return jsonify(formation), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@formation_bp.route('/getFormationByApprentiId', methods=['GET'])
def get_formation_by_apprenti_id():
    try:
        apprenti_id = request.args.get('apprenti_id')
        maitre_id = request.args.get('maitre_id')

        if not apprenti_id or not maitre_id:
            return jsonify({'error': "Maître d'apprentissage ou apprenti introuvable, ID manquant"}), 400

        cur = mysql.connection.cursor()
        query = """
            SELECT f.*
            FROM formation f
            JOIN utilisateurs u ON f.id_formation = u.id_formation
            JOIN supervisions s ON u.id_user = s.id_apprenti
            WHERE s.id_apprenti = %s AND s.id_maitre_apprentissage = %s
        """
        cur.execute(query, (apprenti_id, maitre_id))
        formation = cur.fetchone()
        cur.close()

        if not formation:
            return jsonify({'error': "Aucune formation pour ce Maître d'apprentissage"}), 404

        return jsonify(formation), 200
    except Exception as e:
        print(f"Error: {str(e)}")
        return jsonify({'error': str(e)}), 500



@formation_bp.route('/getBlocsCompByFormationId', methods=['GET'])
def get_blocs_comp_by_formation_id():
    try:
        formation_id = request.args.get('formation_id')
        if not formation_id:
            return jsonify({'error': 'Formation ID is required'}), 400

        cur = mysql.connection.cursor()
        query = """
        SELECT b.id_bloc, b.nom AS bloc_nom, b.description AS bloc_description, c.id_competence, c.nom AS comp_nom, c.description AS comp_description
        FROM bloc_de_competences b
        LEFT JOIN competence c ON b.id_bloc = c.id_bloc
        WHERE b.id_formation = %s
        """
        cur.execute(query, (formation_id,))
        result = cur.fetchall()
        cur.close()

        blocs = {}
        for row in result:
            bloc_id = row['id_bloc']
            if bloc_id not in blocs:
                blocs[bloc_id] = {
                    'id': bloc_id,
                    'nom': row['bloc_nom'],
                    'description': row['bloc_description'],
                    'competences': []
                }
            if row['id_competence']:
                blocs[bloc_id]['competences'].append({
                    'id': row['id_competence'],
                    'nom': row['comp_nom'],
                    'description': row['comp_description']
                })

        return jsonify(blocs), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500




@formation_bp.route('/setPeriodeLivret', methods=['POST'])
def set_periode_livret():
    try:
        request_data = request.get_json()
        user_id = request_data.get('user_id')
        periode = request_data.get('periode')

        if not user_id or not periode:
            return jsonify({'error': 'Données manquantes'}), 400

        cur = mysql.connection.cursor()

        query = """
        SELECT id_formation 
        FROM formation 
        WHERE id_gerant_formation = %s
        """
        cur.execute(query, (user_id,))
        result = cur.fetchone()

        if not result:
            return jsonify({'error': 'Aucune formation trouvée pour cet utilisateur'}), 404

        id_formation = result['id_formation']

        update_query = """
        UPDATE formation
        SET periode = %s
        WHERE id_formation = %s
        """
        cur.execute(update_query, (periode, id_formation))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Période mise à jour avec succès'}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@formation_bp.route('/getAnneesByFormationId', methods=['GET'])
def get_annees_by_formation_id():
    try:
        formation_id = request.args.get('id_formation')

        if not formation_id:
            return jsonify({'error': "L'id de la formation est nécessaire !"}), 400

        cur = mysql.connection.cursor()
        query = """
            SELECT annee
            FROM annees
            WHERE id_formation = %s
        """
        cur.execute(query, (formation_id,))
        result = cur.fetchall()
        cur.close()

        if not result:
            return jsonify({'error': 'No data found for this formation'}), 404

        return jsonify(result), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500



@formation_bp.route('/updateBloc', methods=['POST'])
def update_bloc():
    try:
        data = request.get_json()
        bloc_id = data.get('bloc').get('id')
        nom = data.get('bloc').get('nom')
        description = data.get('bloc').get('description')

        if not bloc_id:
            return jsonify({'error': "Bloc ID is required"}), 400

        cur = mysql.connection.cursor()
        cur.execute("UPDATE bloc_de_competences SET nom = %s, description = %s WHERE id_bloc = %s", (nom, description, bloc_id))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Bloc updated successfully'}), 200

    except Exception as e:
        return jsonify({'error': str(e)}), 500




@formation_bp.route('/updateCompetence', methods=['POST'])
def update_competence():
    try:
        data = request.get_json()
        competence_id = data.get('competence')['id']
        nom = data.get('competence')['nom']
        description = data.get('competence')['description']

        cur = mysql.connection.cursor()
        cur.execute("UPDATE competence SET nom = %s, description = %s WHERE id_competence = %s", (nom, description, competence_id))
        mysql.connection.commit()
        cur.close()

        return jsonify({'message': 'Competence updated successfully'}), 200

    except Exception as e:
        print("Error updating competence:", str(e))
        return jsonify({'error': str(e)}), 500
