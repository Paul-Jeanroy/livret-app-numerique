import Header from "../components/Header";
import Footer from "../components/Footer";
import "../styles/livret.css";
import GrilleEvaluationLivret from "../components/GrilleEvaluationLivret";
import { useEffect, useState } from "react";
import { useUserRole } from "../hooks/useUserRole";
import useFormationData from "../hooks/useFormationData";
import Loader from "../components/Loader";
import axios from 'axios';

export default function Livret() {
    const [f_ficheSignaletique, setFicheSignaletique] = useState(false);
    const [evaluations, setEvaluations] = useState([]);
    const [error, setError] = useState(null);
    const { roleUser, userId } = useUserRole();
    const { formationData, loading, fetchError } = useFormationData(userId);

    useEffect(() => {
        if (formationData?.blocs) {
            setEvaluations(Object.values(formationData.blocs));
        }
    }, [formationData]);

    const handleEvaluationChange = (blocIndex, updatedCompetences) => {
        const newEvaluations = [...evaluations];
        newEvaluations[blocIndex].competences = updatedCompetences;
        setEvaluations(newEvaluations);
    };

    const handleSave = async () => {
        // Check for errors before saving
        for (let bloc of evaluations) {
            for (let comp of bloc.competences) {
                if (!comp.evaluation || comp.evaluation.every((val) => val === false)) {
                    setError("Toutes les compétences doivent être évaluées.");
                    return;
                }
                if (comp.evaluation.some((val) => val === true) && !comp.note) {
                    setError("Toutes les compétences évaluées doivent avoir une note.");
                    return;
                }
            }
        }

        try {
            const payload = {
                userId: userId,
                formationId: formationData.formation.id_formation,
                evaluations: evaluations,
            };
            console.log("Payload:", payload);  // Debug log
            const response = await axios.post('http://localhost:5000/livret/saveEvaluation', payload);
            console.log(response.data);
            setError(null); // Clear any previous errors on successful save
        } catch (saveError) {
            console.error(saveError);
            setError("Erreur lors de la sauvegarde des évaluations.");
        }
    };

    console.log("formationData", formationData);

    if (loading) {
        return <Loader />;
    }

    if (fetchError) {
        return <p>{fetchError}</p>;
    }

    return (
        <>
            <Header />
            <main className="main-container-livret">
                <h1 className="titre_page">Livret de suivi en entreprise</h1>
                {error && <p className="error-message">{error}</p>}
                {!f_ficheSignaletique ? (
                    <div className="div-container-livret">
                        <button className="btn-fiche-sign" onClick={() => setFicheSignaletique(true)}>
                            Fiche Signalétique
                        </button>
                        <div className="div-titre-livret">
                            <h2>Formation : {formationData?.formation?.nom}</h2>
                            <h3>[Période de completion du livret]</h3>
                        </div>

                        <img className="fleche-gauche-livret" src="icon-arrow.svg" style={{ transform: "rotate(180deg)" }} />
                        <img className="fleche-droite-livret" src="icon-arrow.svg" />
                        <div className="div-contenu-aborde">
                            <label>Objectifs / Missions de la période</label>
                            <textarea placeholder="Entrez ici les missions confiées à l'apprenti sur la période"></textarea>
                            <label>Remarques particulières</label>
                            <textarea placeholder="Entrez ici les remarques particulières si besoin"></textarea>
                        </div>

                        {formationData?.blocs && Object.values(formationData.blocs).map((bloc, index) => (
                            <GrilleEvaluationLivret key={index} bloc={bloc} onChange={(updatedCompetences) => handleEvaluationChange(index, updatedCompetences)} />
                        ))}

                        <div className="btn-validation-livret">
                            <button onClick={handleSave}>Valider le livret</button>
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
                    </div>
                ) : (
                    <div className="div-container-fiche-sign">
                        <button className="btn-fiche-sign" onClick={() => setFicheSignaletique(false)}>Retour</button>
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
                )}
            </main>
            <Footer />
        </>
    );
}
