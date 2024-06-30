import { useEffect, useState } from "react";
import axios from "axios";
import { useUserRole } from "../hooks/useUserRole";
import useFormationData from "../hooks/useFormationData";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GrilleEvaluationLivret from "../components/GrilleEvaluationLivret";
import Loader from "../components/Loader";
import "../styles/livret.css";

export default function Livret() {
    const [f_ficheSignaletique, setFicheSignaletique] = useState(false);
    const [evaluations, setEvaluations] = useState([]);
    const [mission, setMission] = useState("");
    const [remarque, setRemarque] = useState("");
    const [selectedApprenti, setSelectedApprenti] = useState(null);
    const [apprentis, setApprentis] = useState([]);
    const [selectedPeriodeIndex, setSelectedPeriodeIndex] = useState(0); // Change to index
    const { roleUser, userId } = useUserRole();
    const { formationData, loading, error } = useFormationData(userId, selectedApprenti);
    const [fetchError, setFetchError] = useState(null);
    const [annees, setAnnees] = useState([]);

    useEffect(() => {
        const fetchApprentis = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/livret/getApprentis?maitreId=${userId}`);
                setApprentis(response.data.apprentis);
                if (response.data.apprentis.length === 1) {
                    setSelectedApprenti(response.data.apprentis[0].id_user);
                }
                console.log("Apprentis fetched:", response.data.apprentis);
                if (!selectedApprenti && response.data.apprentis.length > 0) {
                    setSelectedApprenti(response.data.apprentis[0].id_user);
                }
            } catch (error) {
                console.error("Error fetching apprentis:", error);
            }
        };

        if (roleUser === "maître d'apprentissage") {
            fetchApprentis();
        }
    }, [userId, roleUser]);

    useEffect(() => {
        console.log("Selected Apprenti Updated:", selectedApprenti);
        if (formationData?.blocs) {
            setEvaluations(Object.values(formationData.blocs));
        }

        const sp_get_duree_formation = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/formation/getDureeFormation?id_formation=${formationData?.formation?.id_formation}`);
                const duree = response.data.duree;

                const anneesResponse = await axios.get(`http://localhost:5000/formation/getAnneesByFormationId?id_formation=${formationData?.formation?.id_formation}`);
                setAnnees(anneesResponse.data);

                setSelectedPeriodeIndex(0); // Reset index on new data
            } catch (error) {
                console.error("Error fetching duree and periode:", error);
            }
        };

        if (formationData?.formation?.id_formation) {
            sp_get_duree_formation();
        }
    }, [formationData]);

    const handleEvaluationChange = (blocIndex, updatedCompetences) => {
        const newEvaluations = [...evaluations];
        newEvaluations[blocIndex].competences = updatedCompetences;
        setEvaluations(newEvaluations);
    };

    const handleNavigation = (direction) => {
        const totalPeriods = annees.length * (formationData?.formation?.periode === 'semestre' ? 2 : 3);
        let newIndex = selectedPeriodeIndex + direction;
        if (newIndex < 0) newIndex = totalPeriods - 1;
        if (newIndex >= totalPeriods) newIndex = 0;
        setSelectedPeriodeIndex(newIndex);
    };

    const generateNavigation = (periode, duree, anneesData) => {
        const navButtons = [];
        const periodeNames = {
            semestre: ["Septembre à Février", "Mars à Août"],
            trimestre: ["Septembre à Décembre", "Janvier à Avril", "Mai à Août"],
        };

        const periodeKey = periode.toLowerCase();
        if (!periodeNames[periodeKey]) {
            console.error("Invalid periode:", periode);
            return navButtons;
        }

        for (let i = 0; i < anneesData.length; i++) {
            periodeNames[periodeKey].forEach((p, pIndex) => {
                const periodLabel = `${anneesData[i].annee}-${pIndex + 1} - ${p}`;
                navButtons.push(
                    <button
                        key={`${anneesData[i].annee}-${pIndex}`}
                        className="btn-nav-livret"
                        onClick={() => setSelectedPeriodeIndex(i * periodeNames[periodeKey].length + pIndex)} // Update index
                    >
                        {periodLabel}
                    </button>
                );
            });
        }

        return navButtons;
    };

    const handleSave = async () => {
        for (let bloc of evaluations) {
            for (let comp of bloc.competences) {
                if (!comp.evaluation || comp.evaluation.every((val) => val === false)) {
                    setFetchError("Toutes les compétences doivent être évaluées.");
                    return;
                }
                if (comp.evaluation.some((val) => val === true) && comp.evaluation.indexOf("N/A") === -1 && !comp.note) {
                    setFetchError("Toutes les compétences évaluées doivent avoir une note, sauf celles marquées N/A.");
                    return;
                }
            }
        }

        try {
            const payload = {
                userId: userId,
                formationId: formationData.formation.id_formation,
                apprentiId: selectedApprenti,
                evaluations: evaluations,
                mission: mission,
                remarque: remarque,
                periode: `${annees[Math.floor(selectedPeriodeIndex / (formationData?.formation?.periode === 'semestre' ? 2 : 3))].annee}-${(selectedPeriodeIndex % (formationData?.formation?.periode === 'semestre' ? 2 : 3)) + 1}`,
            };
            const response = await axios.post("http://localhost:5000/livret/saveEvaluation", payload);
            console.log(response.data);
            setFetchError(null);
        } catch (saveError) {
            console.error(saveError);
            setFetchError("Erreur lors de la sauvegarde des évaluations.");
        }
    };

    if (loading) {
        return <Loader />;
    }

    if (error) {
        return <p>{error}</p>;
    }

    const currentPeriodLabel = generateNavigation(formationData?.formation?.periode, formationData?.duree, annees)[selectedPeriodeIndex]?.props.children || '';

    return (
        <>
            <Header />
            <main className="main-container-livret">
                <h1 className="titre_page">Livret de suivi en entreprise</h1>
                {fetchError && <p className="error-message">{fetchError}</p>}
                {!f_ficheSignaletique ? (
                    <div className="div-container-livret">
                        <button className="btn-fiche-sign" onClick={() => setFicheSignaletique(true)}>
                            Fiche Signalétique
                        </button>
                        <div className="div-titre-livret">
                            <h2>Formation : {formationData?.formation?.nom}</h2>
                            <h3>Période : {currentPeriodLabel}</h3>
                        </div>

                        <img className="fleche-gauche-livret" src="icon-arrow.svg" style={{ transform: "rotate(180deg)" }} onClick={() => handleNavigation(-1)} />
                        <img className="fleche-droite-livret" src="icon-arrow.svg" onClick={() => handleNavigation(1)} />
                        <div className="div-contenu-aborde">
                            <label>Objectifs / Missions de la période</label>
                            <textarea placeholder="Entrez ici les missions confiées à l'apprenti sur la période" value={mission} onChange={(e) => setMission(e.target.value)}></textarea>
                            <label>Remarques particulières</label>
                            <textarea placeholder="Entrez ici les remarques particulières si besoin" value={remarque} onChange={(e) => setRemarque(e.target.value)}></textarea>
                        </div>

                        {formationData?.blocs &&
                            Object.values(formationData.blocs).map((bloc, index) => (
                                <GrilleEvaluationLivret key={index} bloc={bloc} onChange={(updatedCompetences) => handleEvaluationChange(index, updatedCompetences)} />
                            ))}

                        <div className="btn-validation-livret">
                            <button onClick={handleSave}>Valider le livret</button>
                        </div>

                        <div className="div-navigation-livret">
                            {formationData?.formation && generateNavigation(formationData.formation.periode, formationData.duree, annees)}
                        </div>
                    </div>
                ) : (
                    <div className="div-container-fiche-sign">
                        <button className="btn-fiche-sign" onClick={() => setFicheSignaletique(false)}>Retour</button>
                        <div className="div-navigation-livret">
                            {formationData?.formation && generateNavigation(formationData.formation.periode, formationData.duree, annees)}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
