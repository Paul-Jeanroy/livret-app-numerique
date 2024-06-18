import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/creationTitre.css";

import { useState } from "react";

export default function CreationTitre() {
    const [w_codeRncp, setCodeRncp] = useState('');
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
            console.log(data);

        } catch (error) {
            console.error('Erreur lors de la connexion :', error.message);
            setErrorMessage('Code RNCP NON VALIDE');
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
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
