import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../styles/tableauEvaluationLivret.css";
import { useUserRole } from "../hooks/useUserRole";

export default function TableauEvaluationLivret({ selectedPeriodeIndex, annees, formationData }) {
    const { userId } = useUserRole();
    const [modules, setModules] = useState([]);
    const [moduleInput, setModuleInput] = useState("");

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const anneeIndex = Math.floor(selectedPeriodeIndex / (formationData.periode === 'semestre' ? 2 : 3));
                const periodeIndex = (selectedPeriodeIndex % (formationData.periode === 'semestre' ? 2 : 3)) + 1;
                const periodeLabel = `${annees[anneeIndex].annee}-${periodeIndex}`;

                const response = await axios.get("http://localhost:5000/livret/getLivretApprenti", {
                    params: {
                        apprentiId: userId,
                        periode: periodeLabel,
                        formationId: formationData.id_formation
                    }
                });

                if (response.data.modules) {
                    setModules(response.data.modules);
                } else {
                    setModules([]);
                }
            } catch (error) {
                console.error("Error fetching modules:", error);
                toast.error("Erreur lors de la récupération des modules.");
            }
        };

        if (userId && annees.length > 0 && formationData) {
            fetchModules();
        }
    }, [userId, selectedPeriodeIndex, annees, formationData]);

    const sp_ajouter_module = () => {
        if (moduleInput.trim() !== "") {
            setModules([...modules, moduleInput]);
            setModuleInput("");
        } else {
            toast.error("Le champ du module ne peut pas être vide.");
        }
    };

    const handleSave = async () => {
        try {
            const anneeIndex = Math.floor(selectedPeriodeIndex / (formationData.periode === 'semestre' ? 2 : 3));
            const periodeIndex = (selectedPeriodeIndex % (formationData.periode === 'semestre' ? 2 : 3)) + 1;
            const periodeLabel = `${annees[anneeIndex].annee}-${periodeIndex}`;

            const payload = {
                modules,
                apprentiId: userId,
                periode: periodeLabel,
                formationId: formationData.id_formation
            };

            const response = await axios.post("http://localhost:5000/livret/setLivretApprenti", payload);
            toast.success("Modules sauvegardés avec succès.");
        } catch (error) {
            console.error("Error saving modules:", error);
            toast.error(`${error.response?.data?.error || error.message}`);
        }
    };

    return (
        <>
            <div className="container-tableau-evaluation">
                <div className="container-ecriture-contenu">
                    <label>Modules étudiés</label>
                    <textarea
                        placeholder="Entrez ici les modules étudiés durant la période"
                        value={moduleInput}
                        onChange={(e) => setModuleInput(e.target.value)}
                    ></textarea>
                    <button onClick={sp_ajouter_module}>Enregistrer</button>
                </div>

                <table className="tab-evaluation">
                    <thead className="thead_evaluation_tab">
                        <tr>
                            <th>Modules étudiés en entreprise</th>
                        </tr>
                    </thead>
                    <tbody className="tbody_evaluation_tab">
                        {modules.length > 0 ? (
                            modules.map((module, index) => (
                                <tr key={index} className="tr_evaluation_tab">
                                    <td className="td_evaluation_tab">{module}</td>
                                </tr>
                            ))
                        ) : (
                            <tr className="tr_evaluation_tab">
                                <td className="td_evaluation_tab">Aucun module étudié</td>
                            </tr>
                        )}
                    </tbody>
                </table>
                
                <div className="btn-validation-livret-apprenti">
                    <button onClick={handleSave}>Valider le livret</button>
                </div>
            </div>
        </>
    );
}
