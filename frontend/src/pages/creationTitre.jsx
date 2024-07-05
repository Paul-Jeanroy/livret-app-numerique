/* Page Création de titre (formation)

    Par Paul Jeanroy

    Fonctionnalités :
    - sp_valider_formulaire : Vérifie le code RNCP et récupère les informations de la formation correspondantes.
    - sp_get_bloc_comp_formation : Récupère les blocs de compétences de la formation.

*/

// Import de composants
import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader"
import ContainerBlocCompetences from "../components/ContainerBlocCompetences";

// Import externes
import axios from "axios"
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Impoort CSS
import "../styles/creationTitre.css";

// Import REACT
import { useEffect, useState } from "react";

// Import hook personalisé
import { useUserRole } from '../hooks/useUserRole';

export default function CreationTitre() {
    const { userId } = useUserRole()
    const [w_code_rncp, setCodeRncp] = useState('');
    const [w_tt_info_formation, setInfoFormation] = useState(null);
    const [o_data_bloc_comp, setDataBlocComp] = useState({});
    const [f_chargement_donnee, setChargementDonnee] = useState(false);

    const sp_valider_formulaire = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/livret/getInfoFormation?w_codeRncp=${w_code_rncp}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erreur HTTP, statut : ' + response.status);
            }

            const data = await response.json();
            setInfoFormation(data);

            await sp_get_bloc_comp_formation(data);

        } catch (error) {
            setInfoFormation(null);
            toast.error('Code RNCP invalide, veuillez réessayer avec un autre.');
        }
    };

    const sp_get_bloc_comp_formation = async (o_info_formation) => {
        try {
            const w_lien_pdf = o_info_formation['fichier_pdf'];
            if (!w_lien_pdf) {
                toast.error('Chemin du fichier PDF non trouvé dans les informations de la formation');
            }

            setChargementDonnee(true);

            const response = await axios.get(`http://localhost:5000/livret/getBlocCompetencesFromPDF?pdf_path=${w_lien_pdf}`, {
                responseType: 'json',
            });

            const data = response.data;
            if (typeof data !== 'object') {
                throw new Error('Les données reçues ne sont pas un objet');
            }

            setDataBlocComp(data);
            setChargementDonnee(false);

        } catch (error) {
            setInfoFormation(null);
            toast.error("Récupération des blocs et compétences impossible");
            setChargementDonnee(false);
        }
    };

    const sp_set_formation = async () => {
        try {
            const response = await fetch(`http://localhost:5000/formation/setFormation?user_id=${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(w_tt_info_formation)
            });
            if (!response.ok) {
                throw new Error('Erreur HTTP, statut : ' + response.status);
            }
            const data = await response.json();

        } catch (error) {
            toast.error("Oups, il y à une erreur lors de l'insertion de la formation.");
        }
    };

    useEffect(() => {
        if (w_tt_info_formation) {
            sp_set_formation();
        }
    }, [w_tt_info_formation]);

    return (
        <>
            <ToastContainer position="top-right" autoClose={10000} />
            <Header />
            <main>
                <section id="section-create-titre">
                    <h1 className="titre_page">Création du titre</h1>
                    <div className="container-search-titre">
                        <form onSubmit={sp_valider_formulaire}>
                            <input type="text" onChange={(e) => setCodeRncp(e.target.value)} placeholder="Veuillez entrer le titre RNCP" />
                            <button type="submit">Rechercher</button>
                        </form>
                        {w_tt_info_formation && (
                            <div className="info-formation">
                                <label>Informations sur la formation :</label>
                                <div>
                                    {w_tt_info_formation.nom + ", " + w_tt_info_formation.niveau}
                                    <img src="/pencil-edit.svg" alt="Modifier" />
                                </div>
                            </div>
                        )}
                        <ContainerBlocCompetences o_data_bloc_comp={o_data_bloc_comp} />
                    </div>
                </section>
            </main>
            {f_chargement_donnee && (<Loader />)}
            <Footer />
        </>
    );
}
