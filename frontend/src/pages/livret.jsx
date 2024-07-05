
/* Page livret: permet l'affichage selon le rôle du livret à completer.

    Par Paul Jeanroy

    Fonctionnalités :
    - sp_get_apprentis : Permet la récupération du ou des apprenants gérer par le MA.
    - sp_get_duree_formation : Permet la récupération de la durée d'une formation.
    - checkPeriodeCompletion : Vérifie si la période de formation est déjà complète.
    - handleEvaluationChange : Gère le changement d'évaluation dans le tableau d'évaluation.
    - generateNavigation : Génère la navigation entre les périodes de formation.
    - handleSave : Enregistre les évaluations dans la base de données. 

*/


// Import REACT
import { useEffect, useState } from "react";

// Import externes
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

// Import Hooks personnalisés
import { useUserRole } from "../hooks/useUserRole";
import useFormationData from "../hooks/useFormationData";

// Import des composants
import Header from "../components/Header";
import Footer from "../components/Footer";
import GrilleEvaluationLivret from "../components/GrilleEvaluationLivret";
import TableauEvaluationLivret from "../components/TableauEvaluationLivret";

// Import CSS
import "../styles/livret.css";

export default function Livret() {
    const [f_fiche_signaletique, setFicheSignaletique] = useState(false);
    const [w_tt_evaluations, setEvaluations] = useState([]);
    const [w_mission, setMission] = useState("");
    const [w_remarque, setRemarque] = useState("");
    const [o_apprenti_selectionne, setApprenti] = useState(null);
    const [i_index_perdiode_select, setSelectedPeriodeIndex] = useState(0);
    const { roleUser, userId } = useUserRole();
    const { formationData } = useFormationData(userId, o_apprenti_selectionne);
    const [w_tt_annees, setAnnees] = useState([]);
    const [periodeCompleted, setPeriodeCompleted] = useState(false);
    const [currentLivretId, setCurrentLivretId] = useState(null);

    useEffect(() => {
        const sp_get_apprentis = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/livret/getApprentis?maitreId=${userId}`);
                if (response.data.apprentis.length === 1) {
                    setApprenti(response.data.apprentis[0].id_user);
                }
                if (!o_apprenti_selectionne && response.data.apprentis.length > 0) {
                    setApprenti(response.data.apprentis[0].id_user);
                }
            } catch (error) {
                console.error("Error fetching apprentis:", error);
            }
        };

        if (roleUser === "maître d'apprentissage") {
            sp_get_apprentis();
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
                console.error("Erreur lors de la récupération de la période de la formation:", error);
            }
        };

        if (formationData?.formation?.id_formation) {
            sp_get_duree_formation();
        }
    }, [formationData]);

    useEffect(() => {
        const checkPeriodeCompletion = async () => {
            if (!formationData || !o_apprenti_selectionne || w_tt_annees.length === 0) return;

            try {
                const anneeIndex = Math.floor(i_index_perdiode_select / (formationData.formation.periode === 'semestre' ? 2 : 3));
                const periodeIndex = (i_index_perdiode_select % (formationData.formation.periode === 'semestre' ? 2 : 3)) + 1;
                const periodeLabel = `${w_tt_annees[anneeIndex].annee}-${periodeIndex}`;

                const url = `http://localhost:5000/livret/checkPeriodeCompletion?formation_id=${formationData.formation.id_formation}&apprenti_id=${o_apprenti_selectionne}&periode=${periodeLabel}`;

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
                console.error("Erreur lors de la récupération des livrets complétés pour la période:", error);
            }
        };

        checkPeriodeCompletion();
    }, [formationData, i_index_perdiode_select, o_apprenti_selectionne, w_tt_annees]);

    const handleEvaluationChange = (blocIndex, updatedCompetences) => {
        const newEvaluations = [...w_tt_evaluations];
        newEvaluations[blocIndex].competences = updatedCompetences;
        setEvaluations(newEvaluations);
    };

    const handleNavigation = (direction) => {
        const totalPeriods = w_tt_annees.length * (formationData?.formation?.periode === 'semestre' ? 2 : 3);
        let newIndex = i_index_perdiode_select + direction;
        if (newIndex < 0) newIndex = totalPeriods - 1;
        if (newIndex >= totalPeriods) newIndex = 0;
        setSelectedPeriodeIndex(newIndex);
    };

    const generateNavigation = (periode, anneesData) => {
        const navButtons = [];
        const periodeNames = {
            semestre: ["Septembre à Février", "Mars à Août"],
            trimestre: ["Septembre à Décembre", "Janvier à Avril", "Mai à Août"],
        };

        const periodeKey = (periode || "").toLowerCase();
        if (!periodeNames[periodeKey]) {
            console.error("Période invalide:", periode);
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
        if (w_mission == "" || w_mission == undefined || w_mission == null) {
            toast.error("Veuillez entrer une mission.");
            return;
        }

        for (let bloc of w_tt_evaluations) {
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
                apprentiId: o_apprenti_selectionne,
                evaluations: w_tt_evaluations,
                mission: w_mission,
                remarque: w_remarque,
                periode: `${w_tt_annees[Math.floor(i_index_perdiode_select / (formationData?.formation?.periode === 'semestre' ? 2 : 3))].annee}-${(i_index_perdiode_select % (formationData?.formation?.periode === 'semestre' ? 2 : 3)) + 1}`,
            };
            const url = currentLivretId
                ? `http://localhost:5000/livret/updateEvaluation/${currentLivretId}`
                : "http://localhost:5000/livret/saveEvaluation";
            const response = currentLivretId
                ? await axios.put(url, payload)
                : await axios.post(url, payload);

            toast.success("Livret sauvegardé avec succès.");
        } catch (saveError) {
            console.error(saveError);
            toast.error("Erreur lors de la sauvegarde des évaluations.");
        }
    };

    const navigationButtons = generateNavigation(formationData?.formation?.periode, formationData?.duree, w_tt_annees);
    const currentPeriodLabel = navigationButtons.length > 0 ? navigationButtons[i_index_perdiode_select].props.children : '';

    return (
        <>
            <Header />
            <ToastContainer position="top-right" autoClose={10000} />
            <main className="main-container-livret">
                <h1 className="titre_page">Livret de suivi en entreprise</h1>
                {!f_fiche_signaletique ? (
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
                                        value={w_mission}
                                        onChange={(e) => setMission(e.target.value)}
                                    ></textarea>
                                    <label>Remarques particulières</label>
                                    <textarea
                                        placeholder="Entrez ici les remarques particulières si besoin"
                                        value={w_remarque}
                                        onChange={(e) => setRemarque(e.target.value)}
                                    ></textarea>
                                </div>


                                {formationData?.blocs &&
                                    w_tt_evaluations.map((bloc, index) => (
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
                                i_index_perdiode_select={i_index_perdiode_select}
                                w_tt_annees={w_tt_annees}
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