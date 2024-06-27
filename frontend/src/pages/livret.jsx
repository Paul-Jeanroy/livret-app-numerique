/* 
    fichier livret.jsx
    Créer le 08/06 par PJ

    Fonctionnalités :
    - ...
*/

import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/livret.css";
import GrilleEvaluationLivret from "../components/GrilleEvaluationLivret";
import { useState } from "react";

export default function Livret() {
    const [f_ficheSignaletique, setFicheSignaletique] = useState(false);
    const [w_menuSelect, setMenuSelect] = useState("L3-1")

    return (
        <>
            <Header />
            <main className="main-container-livret">
                <h1 className="titre_page">Livret de suivi en entreprise</h1>
                {!f_ficheSignaletique ? (
                    <div className="div-container-livret">
                        <button className="btn-fiche-sign" onClick={() => setFicheSignaletique(true)}>
                            Fiche Signalétique
                        </button>
                        <img className="fleche-gauche-livret" src="icon-arrow.svg" style={{ transform: "rotate(180deg)" }} />
                        <img className="fleche-droite-livret" src="icon-arrow.svg" />
                        <div className="div-titre-livret">
                            <h2>[Nom de la formation]</h2>
                            <h3>[Periode de completion du livret]</h3>
                        </div>
                        <div className="div-contenu-aborde">
                            <label>Objectifs / Missions de la période</label>
                            <textarea placeholder="Entrez ici les missions confié à l'apprenti sur la période"></textarea>
                            <label>Remarques particulières</label>
                            <textarea placeholder="Entrez ici les remarques particulières si besoin"></textarea>
                        </div>

                        <GrilleEvaluationLivret />
                        <GrilleEvaluationLivret />
                        <GrilleEvaluationLivret />

                        <div className="div-navigation-livret">
                            <button className="btn-nav-livret">L3-1</button>
                            <button className="btn-nav-livret">L3-2</button>
                            <button className="btn-nav-livret">L3-3</button>
                            <button className="btn-nav-livret">M1-1</button>
                            <button className="btn-nav-livret">M1-2</button>
                            <button className="btn-nav-livret">M1-3</button>
                            <button className="btn-nav-livret">M2-1</button>
                            <button className="btn-nav-livret">M2-2</button>
                            <button className="btn-nav-livret">M2-3</button>
                        </div>
                    </div>
                ) : (
                    <div className="div-container-fiche-sign">
                        <button className="btn-fiche-sign">
                            Fiche Signalétique
                        </button>
                        <div className="div-navigation-livret">
                            <button className="btn-nav-livret" onClick={() => setFicheSignaletique(false)}>L3-1</button>
                            <button className="btn-nav-livret">L3-2</button>
                            <button className="btn-nav-livret">L3-3</button>
                            <button className="btn-nav-livret">M1-1</button>
                            <button className="btn-nav-livret">M1-2</button>
                            <button className="btn-nav-livret">M1-3</button>
                            <button className="btn-nav-livret">M2-1</button>
                            <button className="btn-nav-livret">M2-2</button>
                            <button className="btn-nav-livret">M2-3</button>
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
