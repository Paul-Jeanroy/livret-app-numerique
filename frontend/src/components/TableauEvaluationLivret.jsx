import { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import "../styles/tableauEvaluationLivret.css";
import { useUserRole } from "../hooks/useUserRole";

export default function TableauEvaluationLivret({ i_index_perdiode_select, w_tt_annees, formationData }) {
    const { userId } = useUserRole();
    const [modules, setModules] = useState([]);
    const [moduleInput, setModuleInput] = useState("");

    useEffect(() => {
        const fetchModules = async () => {
            try {
                const anneeIndex = Math.floor(i_index_perdiode_select / (formationData.periode === 'semestre' ? 2 : 3));
                const periodeIndex = (i_index_perdiode_select % (formationData.periode === 'semestre' ? 2 : 3)) + 1;
                const periodeLabel = `${w_tt_annees[anneeIndex].annee}-${periodeIndex}`;

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

        if (userId && w_tt_annees.length > 0 && formationData) {
            fetchModules();
        }
    }, [userId, i_index_perdiode_select, w_tt_annees, formationData]);

    const sp_ajouter_module = () => {
        if (moduleInput.trim() !== "") {
            setModules([...modules, moduleInput]);
            setModuleInput("");
        } else {
            toast.error("Le champ du module ne peut pas être vide.");
        }
    };

    const removeModule = (index) => {
        const newModules = modules.filter((_, i) => i !== index);
        setModules(newModules);
    };

    const handleSave = async () => {
        try {
            const anneeIndex = Math.floor(i_index_perdiode_select / (formationData.periode === 'semestre' ? 2 : 3));
            const periodeIndex = (i_index_perdiode_select % (formationData.periode === 'semestre' ? 2 : 3)) + 1;
            const periodeLabel = `${w_tt_annees[anneeIndex].annee}-${periodeIndex}`;

            const payload = {
                modules,
                apprentiId: userId,
                periode: periodeLabel,
                formationId: formationData.id_formation
            };

            const response = await axios.post("http://localhost:5000/livret/setLivretApprenti", payload);
            toast.success("Livret sauvegardés avec succès.");
        } catch (error) {
            console.error("Erreuyr lors de la sauvegarde du livret:", error);
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
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody className="tbody_evaluation_tab">
                        {modules.length > 0 ? (
                            modules.map((module, index) => (
                                <tr key={index} className="tr_evaluation_tab">
                                    <td className="td_evaluation_tab">{module}</td>
                                    <td className="td_action_tab">
                                        <button onClick={() => removeModule(index)}>Supprimer</button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr className="tr_evaluation_tab">
                                <td className="td_evaluation_tab">Aucun module étudié</td>
                                <td className="td_evaluation_tab"></td>
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
