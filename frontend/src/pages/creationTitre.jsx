import Header from "../components/Header";
import Footer from "../components/Footer";
import Loader from "../components/Loader"
import axios from "axios"
import "../styles/creationTitre.css";

import { useEffect, useState } from "react";
import ContainerBlocCompetences from "../components/ContainerBlocCompetences";
import { useUserRole } from '../hooks/useUserRole';

export default function CreationTitre() {
    const {userId} = useUserRole()
    const [w_codeRncp, setCodeRncp] = useState('');
    const [w_tt_info_formation, setInfoFormation] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [o_tt_dataBlocComp, setDataBlocComp] = useState({});
    const [isLoading, setIsLoading] = useState(false);

    const sp_valider_formulaire = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5000/livret/getInfoFormation?w_codeRncp=${w_codeRncp}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (!response.ok) {
                throw new Error('Erreur HTTP, statut : ' + response.status);
            }

            const data = await response.json();
            setErrorMessage('');
            setInfoFormation(data);

            await sp_get_bloc_comp_formation(data);

        } catch (error) {
            setInfoFormation(null);
            setErrorMessage('Code RNCP NON VALIDE ou FORMATION INVALIDE');
        }
    };

    const sp_get_bloc_comp_formation = async (infoFormation) => {
        console.log(infoFormation);
        try {
            const pdfPath = infoFormation['fichier_pdf'];
            if (!pdfPath) {
                throw new Error('Chemin du fichier PDF non trouvé dans les informations de formation');
            }

            setIsLoading(true);

            const response = await axios.get(`http://localhost:5000/livret/getBlocCompetencesFromPDF?pdf_path=${pdfPath}`, {
                responseType: 'json',
            });

            const data = response.data;
            if (typeof data !== 'object') {
                throw new Error('Les données reçues ne sont pas un objet');
            }
            setErrorMessage('');
            setDataBlocComp(data);
            setIsLoading(false);

        } catch (error) {
            setInfoFormation(null);
            setErrorMessage('Récupération des blocs et compétences impossible : ' + error.message);
            setIsLoading(false);
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
            console.log(data);
        } catch (error) {
            console.error("Erreur lors de l'insertion de la formation :", error);
        }
    };

    useEffect(() => {
        if (w_tt_info_formation) {
            sp_set_formation();
        }
    }, [w_tt_info_formation]);

    return (
        <>
            <Header />
            <main>
                <section id="section-create-titre">
                    <h1 className="titre_page">Création du titre</h1>
                    <div className="container-search-titre">
                        <form onSubmit={sp_valider_formulaire}>
                            <input type="text" onChange={(e) => setCodeRncp(e.target.value)} placeholder="Veuillez entrer le titre RNCP" />
                            <button type="submit">Rechercher</button>
                        </form>
                        {errorMessage && <p className="error">{errorMessage}</p>}
                        {w_tt_info_formation && (
                            <div className="info-formation">
                                <label>Informations sur la formation :</label>
                                <div>
                                    {w_tt_info_formation.nom + ", " + w_tt_info_formation.niveau}
                                    <img src="/pencil-edit.svg" alt="Edit" />
                                </div>
                            </div>
                        )}
                        <ContainerBlocCompetences data={o_tt_dataBlocComp}/>
                    </div>
                </section>
            </main>
            {isLoading && (<Loader />)}
            <Footer />
        </>
    );
}
