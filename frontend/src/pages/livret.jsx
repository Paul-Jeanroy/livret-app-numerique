import { useEffect, useState } from "react";
import axios from "axios";
import { useUserRole } from "../hooks/useUserRole";
import useFormationData from "../hooks/useFormationData";
import Header from "../components/Header";
import Footer from "../components/Footer";
import GrilleEvaluationLivret from "../components/GrilleEvaluationLivret";
import Loader from "../components/Loader";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../styles/livret.css";
import TableauEvaluationLivret from "../components/TableauEvaluationLivret";

export default function Livret() {
    const [f_ficheSignaletique, setFicheSignaletique] = useState(false);
    const [evaluations, setEvaluations] = useState([]);
    const [mission, setMission] = useState("");
    const [remarque, setRemarque] = useState("");
    const [selectedApprenti, setSelectedApprenti] = useState(null);
    const [selectedPeriodeIndex, setSelectedPeriodeIndex] = useState(0);
    const { roleUser, userId } = useUserRole();
    const { formationData, loading, error } = useFormationData(userId, selectedApprenti);
    const [annees, setAnnees] = useState([]);
    const [periodeCompleted, setPeriodeCompleted] = useState(false);
    const [currentLivretId, setCurrentLivretId] = useState(null);

    useEffect(() => {
        const fetchApprentis = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/livret/getApprentis?maitreId=${userId}`);
                if (response.data.apprentis.length === 1) {
                    setSelectedApprenti(response.data.apprentis[0].id_user);
                }
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
        if (formationData?.blocs) {
            setEvaluations(Object.values(formationData.blocs));
        }

        const sp_get_duree_formation = async () => {
            try {
                const anneesResponse = await axios.get(`http://localhost:5000/formation/getAnneesByFormationId?id_formation=${formationData?.formation?.id_formation}`);
                setAnnees(anneesResponse.data);

                setSelectedPeriodeIndex(0);
            } catch (error) {
                console.error("Error fetching duree and periode:", error);
            }
        };

        if (formationData?.formation?.id_formation) {
            sp_get_duree_formation();
        }
    }, [formationData]);

    useEffect(() => {
        const checkPeriodeCompletion = async () => {
            if (!formationData || !selectedApprenti || annees.length === 0) return;

            try {
                const anneeIndex = Math.floor(selectedPeriodeIndex / (formationData.formation.periode === 'semestre' ? 2 : 3));
                const periodeIndex = (selectedPeriodeIndex % (formationData.formation.periode === 'semestre' ? 2 : 3)) + 1;
                const periodeLabel = `${annees[anneeIndex].annee}-${periodeIndex}`;

                const url = `http://localhost:5000/livret/checkPeriodeCompletion?formation_id=${formationData.formation.id_formation}&apprenti_id=${selectedApprenti}&periode=${periodeLabel}`;

                const response = await axios.get(url);
                setPeriodeCompleted(response.data.completed);
                if (response.data.completed) {
                    const completedData = JSON.parse(response.data.completed.evaluation);
                    setEvaluations(completedData.map(item => ({ competences: item.competences, description: item.description, nom: item.nom })));
                    setMission(response.data.completed.mission);
                    setRemarque(response.data.completed.remarque);
                    setCurrentLivretId(response.data.completed.id_livret);
                } else {
                    setEvaluations(Object.values(formationData.blocs).map(bloc => ({
                        ...bloc,
                        competences: bloc.competences.map(comp => ({ ...comp, evaluation: [false, false, false, false, false, false], note: "" }))
                    })));
                    setMission("");
                    setRemarque("");
                    setCurrentLivretId(null);
                }
            } catch (error) {
                console.error("Error checking periode completion:", error);
            }
        };

        checkPeriodeCompletion();
    }, [formationData, selectedPeriodeIndex, selectedApprenti, annees]);

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
                        onClick={() => setSelectedPeriodeIndex(i * periodeNames[periodeKey].length + pIndex)}
                    >
                        {periodLabel}
                    </button>
                );
            });
        }

        return navButtons;
    };

    const handleSave = async () => {

        if (mission == "" || mission == undefined || mission == null) {
            toast.error("Veuillez entrer une mission.");
            return;
        }

        for (let bloc of evaluations) {
            for (let comp of bloc.competences) {
                if (!comp.evaluation || comp.evaluation.every((val) => val === false)) {
                    toast.error("Toutes les compétences doivent être évaluées.");
                    return;
                }
                if (comp.evaluation.some((val) => val === true && !comp.evaluation[5]) && !comp.note) {
                    toast.error("Toutes les compétences évaluées doivent avoir une note, sauf celles marquées N/A.");
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
            const url = currentLivretId
                ? `http://localhost:5000/livret/updateEvaluation/${currentLivretId}`
                : "http://localhost:5000/livret/saveEvaluation";
            const response = currentLivretId
                ? await axios.put(url, payload)
                : await axios.post(url, payload);

            console.log(response.data);
            toast.success("Livret sauvegardé avec succès.");
        } catch (saveError) {
            console.error(saveError);
            toast.error("Erreur lors de la sauvegarde des évaluations.");
        }
    };

    if (loading) {
        return <Loader />;
    }

    const navigationButtons = generateNavigation(formationData?.formation?.periode, formationData?.duree, annees);
    const currentPeriodLabel = navigationButtons.length > 0 ? navigationButtons[selectedPeriodeIndex].props.children : '';

    return (
        <>
            <Header />
            <ToastContainer position="top-right" autoClose={10000} />
            <main className="main-container-livret">
                <h1 className="titre_page">Livret de suivi en entreprise</h1>
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

                        {roleUser == "maître d'apprentissage" && (
                            <>
                                <div className="div-contenu-aborde">
                                    <label>Objectifs / Missions de la période</label>
                                    <textarea
                                        placeholder="Entrez ici les missions confiées à l'apprenti sur la période"
                                        value={mission}
                                        onChange={(e) => setMission(e.target.value)}
                                    ></textarea>
                                    <label>Remarques particulières</label>
                                    <textarea
                                        placeholder="Entrez ici les remarques particulières si besoin"
                                        value={remarque}
                                        onChange={(e) => setRemarque(e.target.value)}
                                    ></textarea>
                                </div>


                                {formationData?.blocs &&
                                    evaluations.map((bloc, index) => (
                                        <GrilleEvaluationLivret
                                            key={index}
                                            bloc={bloc}
                                            onChange={(updatedCompetences) => handleEvaluationChange(index, updatedCompetences)}
                                            completed={periodeCompleted}
                                        />
                                    ))}
                                <div className="btn-validation-livret">
                                    <button onClick={handleSave}>Valider le livret</button>
                                </div>
                            </>
                        )}

                        {roleUser == "apprenti" && (
                            <TableauEvaluationLivret
                                selectedPeriodeIndex={selectedPeriodeIndex}
                                annees={annees}
                                formationData={formationData?.formation}
                            />
                        )}


                        <div className="div-navigation-livret">
                            {formationData?.formation && navigationButtons}
                        </div>
                    </div>
                ) : (
                    <div className="div-container-fiche-sign">
                        <button className="btn-fiche-sign" onClick={() => setFicheSignaletique(false)}>Retour</button>
                        <div className="div-navigation-livret">
                            {formationData?.formation && navigationButtons}
                        </div>
                    </div>
                )}
            </main>
            <Footer />
        </>
    );
}
