import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/livret.css";
import GrilleEvaluationLivret from "../components/GrilleEvaluationLivret";
import { useEffect, useState } from "react";
import { useUserRole } from "../hooks/useUserRole";

export default function Livret() {
    const [f_ficheSignaletique, setFicheSignaletique] = useState(false);
    const [w_menuSelect, setMenuSelect] = useState("L3-1");
    const { roleUser, userId } = useUserRole();
    const [infoFormation, setInfoFormation] = useState(null);

    useEffect(() => {
        const sp_get_info_formation = async () => {
            try {
                const response = await fetch(`http://localhost:5000/user/getInfoFormationByUserId?user_id=${userId}`, {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                });
                const data = await response.json();
                console.log(data);
                setInfoFormation(data);
            } catch (error) {
                console.error("Erreur lors de la récupération des infos la formation de l'utilisateur:", error);
            }
        }

        sp_get_info_formation();
    }, [userId]);

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
                        <div className="div-titre-livret">
                            <h2>Formation : {infoFormation.nom}</h2>
                            <h3>{infoFormation ? infoFormation.periode : "[Periode de completion du livret]"}</h3>
                        </div>

                        {roleUser === "maître d'apprentissage" ? (
                            <>
                                <img className="fleche-gauche-livret" src="icon-arrow.svg" style={{ transform: "rotate(180deg)" }} />
                                <img className="fleche-droite-livret" src="icon-arrow.svg" />
                                <div className="div-contenu-aborde">
                                    <label>Objectifs / Missions de la période</label>
                                    <textarea placeholder="Entrez ici les missions confiées à l'apprenti sur la période"></textarea>
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
                            </>
                        ) : (
                            roleUser === "apprenti" && (
                                <>
                                    <div className="div-contenu-aborde">
                                        <label>Objectifs / Missions de la période</label>
                                        <textarea placeholder="Entrez ici les missions confiées à l'apprenti sur la période"></textarea>
                                        <label>Remarques particulières</label>
                                        <textarea placeholder="Entrez ici les remarques particulières si besoin"></textarea>
                                    </div>

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
                                </>
                            )
                        )}
                    </div>
                ) : (
                    <div className="div-container-fiche-sign">
                        <button className="btn-fiche-sign">Fiche Signalétique</button>
                        <div className="div-navigation-livret">
                            <button className="btn-nav-livret" onClick={() => setFicheSignaletique(false)}>
                                L3-1
                            </button>
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
