import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/creationTitre.css";

import { useState } from "react";

export default function CreationTitre() {
    const [w_codeRncp, setCodeRncp] = useState('');
    const [w_tt_info_formation, setInfoFormation] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

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
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
