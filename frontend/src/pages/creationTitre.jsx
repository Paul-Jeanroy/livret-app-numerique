import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/creationTitre.css";

import { useState } from "react";
import axios from 'axios';
import ContainerBlocCompetences from "../components/ContainerBlocCompetences";

export default function CreationTitre() {
    const [w_codeRncp, setCodeRncp] = useState('');
    const [w_tt_info_formation, setInfoFormation] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const [o_tt_dataBlocComp, setDataBlocComp] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [loadingProgress, setLoadingProgress] = useState(0);

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
            setLoadingProgress(0);

            const response = await axios.get(`http://localhost:5000/livret/getBlocCompetencesFromPDF?pdf_path=${pdfPath}`, {
                responseType: 'json',
                onDownloadProgress: (progressEvent) => {
                    const total = progressEvent.total;
                    const current = progressEvent.loaded;
                    const percentCompleted = Math.round((current / total) * 100);
                    setLoadingProgress(percentCompleted);
                }
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
                                    <input disabled value={w_tt_info_formation.nom + ", " + w_tt_info_formation.niveau} />
                                    <img src="/pencil-edit.svg"></img>
                                </div>
                            </div>
                        )}
                        {/* Afficher les informations supplémentaires du PDF si disponibles */}
                        <ContainerBlocCompetences data={o_tt_dataBlocComp} />
                    </div>
                </section>
            </main>
            {isLoading && (
                <div className="loading-popup">
                    <div className="loading-content">
                        <p>Récupération des infos de la formation en cours</p>
                        <progress value={loadingProgress} max="100">{loadingProgress}%</progress>
                        <p>{loadingProgress}%</p>
                    </div>
                </div>
            )}
            <Footer />
        </>
    );
}
