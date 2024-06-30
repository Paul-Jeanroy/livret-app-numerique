import { useState } from "react";
import "../styles/grilleEvaluationLivret.css";

const GrilleEvaluationLivret = ({ bloc, onChange }) => {
    const [competences, setCompetences] = useState(bloc.competences);

    const handleCheckboxChange = (compIndex, evalIndex) => {
        const newCompetences = competences.map((comp, index) => {
            if (index === compIndex) {
                const newEvaluation = [false, false, false, false, false, false];
                newEvaluation[evalIndex] = true;
                return { ...comp, evaluation: newEvaluation };
            }
            return comp;
        });
        setCompetences(newCompetences);
        onChange(newCompetences);  // Notify parent component of the change
    };

    const handleNoteChange = (compIndex, note) => {
        const newCompetences = competences.map((comp, index) => {
            if (index === compIndex) {
                return { ...comp, note };
            }
            return comp;
        });
        setCompetences(newCompetences);
        onChange(newCompetences);  // Notify parent component of the change
    };

    return (
        <div className="grille-container">
            <table className="evaluation-table">
                <thead>
                    <tr>
                        <th rowSpan="1" colSpan="2" className="header-cell" style={{ borderTopLeftRadius: "12px" }}>
                            Evaluation des compétences - {bloc.nom}
                        </th>
                        <th colSpan="6" className="header-cell">
                            Evaluations
                        </th>
                        <th rowSpan="2" className="header-cell" style={{ borderTopRightRadius: "12px" }}>
                            Notation si <br />réalisé (sur 20)
                        </th>
                    </tr>
                    <tr>
                        <th rowSpan="1" colSpan="2" className="header-cell">
                            L'apprenant est-il capable en autonomie de :
                        </th>
                        <th className="evaluation-cell" style={{ backgroundColor: "red" }}>
                            Non débuté
                        </th>
                        <th className="evaluation-cell" style={{ backgroundColor: "orange" }}>
                            En cours d'acquisition
                        </th>
                        <th className="evaluation-cell" style={{ backgroundColor: "yellow" }}>
                            Acquis
                        </th>
                        <th className="evaluation-cell" style={{ backgroundColor: "lightgreen" }}>
                            Bien acquis
                        </th>
                        <th className="evaluation-cell" style={{ backgroundColor: "green" }}>
                            Très bien acquis
                        </th>
                        <th className="evaluation-cell">N/A</th>
                    </tr>
                </thead>
                <tbody>
                    {competences.map((competence, compIndex) => (
                        <tr key={compIndex}>
                            {compIndex === 0 && (
                                <td className="competence-cell" rowSpan={competences.length} style={{ borderBottomLeftRadius: "12px" }}>
                                    {bloc.description}
                                </td>
                            )}
                            <td className="competence-cell">{competence.description}</td>
                            {Array(6)
                                .fill()
                                .map((_, evalIndex) => (
                                    <td className="score-cell" key={evalIndex} onClick={() => handleCheckboxChange(compIndex, evalIndex)}>
                                        <input
                                            type="checkbox"
                                            checked={competence.evaluation && competence.evaluation[evalIndex]}
                                            onChange={() => handleCheckboxChange(compIndex, evalIndex)}
                                        />
                                    </td>
                                ))}
                            <td className="validation-cell">
                                <input
                                    type="text"
                                    placeholder="N/A"
                                    value={competence.note}
                                    onChange={(e) => handleNoteChange(compIndex, e.target.value)}
                                />
                            </td>
                        </tr>
                    ))}
                    <tr>
                        <td colSpan="8"></td>
                        <td className="competence-cell" style={{ borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px" }}>
                            N/A
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default GrilleEvaluationLivret;
