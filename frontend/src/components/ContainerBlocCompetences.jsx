/* Composant ContainerBlocCompetences.jsx : Permet l'affichages des blocs et des compétences d'une formation

    Fait par Paul Jeanroy

    Fonctionnalités :
    - sp_valider_modification : Enregistre les modifications apportées aux blocs et compétences de la formation
    - sp_extract_text_bloc : Extrait uniquement le texte du bloc de formation (pour affichage)
    - sp_extract_titre_bloc : Extrait uniquement le titre du bloc de formation (pour affichage)
    - sp_extract_num_comp : Extrait le numéro de compétence à partir du texte d'une compétence (pour trier)
    - sp_trier_competence : Trie les compétences par ordre alphabétique
    - sp_rendu_competence : Rend la compétence avec son numéro et son titre automatiquement (pour affichage)
    - sp_clean_comp_texte : Nettoie le texte de la compétence en supprimant les caractères inutiles
    - sp_verif_bloc_comp : Vérifie si la formation a des blocs et des compétences

*/

// Import REACT
import { useState, useEffect } from 'react';

// Import CSS
import '../styles/containerBlocCompetences.css';

// Import EXTERNE
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Import Hooks perso
import { useUserRole } from '../hooks/useUserRole';
import { useNavigate } from 'react-router-dom';

export default function ContainerBlocCompetences({ o_data_bloc_comp }) {
    const [o_donnees_modif, setModifData] = useState({});
    const { userId } = useUserRole();
    const navigate = useNavigate(); 


    useEffect(() => {
        setModifData(o_data_bloc_comp);
    }, [o_data_bloc_comp]);

    const sp_valider_modification = async () => {
        try {
            const response = await axios.post('http://localhost:5000/formation/setBlocCompFormation', { data: o_donnees_modif, user_id: userId });
            toast.success("Aout des informations de le formation avec succès.");
            navigate("/gestionFormation");
        } catch (error) {
            toast.error("Oups, il y à une erreur lors de l'ajout des données.");
        }
    };

    const sp_extract_text_bloc = (w_texte_bloc) => {
        if (!w_texte_bloc) {
            console.error("sp_extract_text_bloc: w_texte_bloc is undefined or null");
            return '';
        }
        let w_tt_match = w_texte_bloc.match(/(BLOC|Bloc) \d+ [\-–] ([^-–]*?)(A\d+)/);
        if (w_tt_match) {
            return w_tt_match[2].trim();
        }

        w_tt_match = w_texte_bloc.match(/(BLOC|Bloc) \d+ ?: ([^A]*?)(A\d+|$)/);
        if (w_tt_match) {
            return w_tt_match[2].trim();
        }

        return w_texte_bloc;
    };

    const sp_extract_titre_bloc = (w_texte_bloc) => {
        if (!w_texte_bloc) {
            console.error("sp_extract_titre_bloc: w_texte_bloc is undefined or null");
            return '';
        }
        const w_tt_match = w_texte_bloc.match(/(BLOC|Bloc) \d+/);
        if (w_tt_match) {
            return w_tt_match[0];
        }
        return w_texte_bloc;
    };

    const sp_extract_num_comp = (w_competence) => {
        if (!w_competence) {
            console.error("sp_extract_num_comp: w_competence is undefined or null");
            return '';
        }
        const w_tt_match = w_competence.match(/C(\d+([a-d]|\.\d+)?)/);
        if (w_tt_match) {
            return w_tt_match[1];
        }
        return null;
    };

    const sp_trier_competence = (w_tt_competences) => {
        return w_tt_competences.slice().sort((a, b) => {
            const i_numA = sp_extract_num_comp(a);
            const i_numB = sp_extract_num_comp(b);
            if (i_numA && i_numB) {
                return i_numA.localeCompare(i_numB, undefined, { numeric: true, sensitivity: 'base' });
            }
            return 0;
        });
    };

    const sp_rendu_competence = (w_competence) => {
        const i_num_comp = sp_extract_num_comp(w_competence);
        if (i_num_comp) {
            return `compétence n°${i_num_comp}`;
        }
        return "compétence";
    };

    const sp_clean_comp_texte = (w_competence) => {
        if (!w_competence) {
            console.error("sp_clean_comp_texte: w_competence is undefined or null");
            return '';
        }
        return w_competence.replace(/^C\d+(\.\d+|[a-zA-Z]?)?\s*-?\s*/, '').trim();
    };

    const sp_verif_bloc_comp = () => {
        return Object.keys(o_donnees_modif).length > 0 && Object.values(o_donnees_modif).some(bloc => bloc.competences && bloc.competences.length > 0);
    };

    return (
        <>
            <ToastContainer position="top-right" autoClose={10000} />
            <div className="div_container_bloc_comp">
                {Object.entries(o_data_bloc_comp).map(([key, o_blocData], index) => (
                    <div key={index} className="div_bloc">
                        <h2>
                            {sp_extract_titre_bloc(o_blocData.bloc)}
                        </h2>
                        <div className="div_texte_bloc">
                            {sp_extract_text_bloc(o_blocData.bloc)}
                        </div>
                        {o_blocData.competences && o_blocData.competences.length > 0 && (
                            sp_trier_competence(o_blocData.competences).map((competence, index) => (
                                <div key={index} className="div_competence">
                                    <p>{sp_rendu_competence(competence)}</p>
                                    <div className="div_texte_competence">
                                        {sp_clean_comp_texte(competence)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ))}
            </div>
            {sp_verif_bloc_comp() && (
                <button onClick={sp_valider_modification}>Valider la création du titre</button>
            )}
        </>
    );
}
