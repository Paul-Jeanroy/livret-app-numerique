import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/creationTitre.css";

import { useState } from "react";

export default function CreationTitre() {
    const [w_codeRncp, setCodeRncp] = useState('');
    const [w_tt_info_formation, setInfoFormation] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    const valider_formulaire = async (e) => {
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

            // // Effectuer une seconde requête pour récupérer des informations supplémentaires à partir du PDF
            // if (data.fichier_pdf) {
            //     const pdfResponse = await fetch(`http://localhost:5000/livret/getInfoPdf?pdf_url=${encodeURIComponent(data.fichier_pdf)}`, {
            //         method: 'GET',
            //         headers: {
            //             'Content-Type': 'application/json'
            //         }
            //     });

            //     if (!pdfResponse.ok) {
            //         throw new Error('Erreur HTTP, statut : ' + pdfResponse.status);
            //     }

            //     const pdfData = await pdfResponse.json();
            //     console.log('PDF Data:', pdfData);
            //     setPdfData(pdfData);
            // }

        } catch (error) {
            setInfoFormation(null);
            setErrorMessage('Code RNCP NON VALIDE ou FORMATION INVALIDE');
        }
    };

    return (
        <>
            <Header />
            <main>
                <section id="section-create-titre">
                    <h1 className="titre_page">Création du titre</h1>
                    <div className="container-search-titre">
                        <form onSubmit={valider_formulaire}>
                            <input type="text" onChange={(e) => setCodeRncp(e.target.value)} placeholder="Veuillez entrer le titre RNCP" />
                            <button type="submit">Rechercher</button>
                        </form>
                        {errorMessage && <p className="error">{errorMessage}</p>}
                        {w_tt_info_formation && (
                            <div className="info-formation">
                                <p>Intitulé : {w_tt_info_formation.nom}</p>
                                <p>Code RNCP : {w_tt_info_formation.code}</p>
                                <p>Niveau : {w_tt_info_formation.niveau}</p>
                                <p>Liens pdf : <a>{w_tt_info_formation.fichier_pdf}</a></p>
                            </div>
                        )}
                        {/* Afficher les informations supplémentaires du PDF si disponibles */}
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
