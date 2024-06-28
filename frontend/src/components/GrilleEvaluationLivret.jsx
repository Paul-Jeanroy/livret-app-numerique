
/* 
    composant GrilleEvalutationLivret.jsx
    Créer le 26/06 par PJ

    Fonctionnalité :
    - ...
    
*/

import "../styles/grilleEvaluationLivret.css";

const GrilleEvaluationLivret = () => {
    return (
        <div className="grille-container">
            <table className="evaluation-table">
                <thead>
                    <tr>
                        <th rowSpan="1" colSpan="2" className="header-cell" style={{ borderTopLeftRadius: "12px" }}>
                            Evaluation des compétences - [Nom de la formation]
                        </th>
                        <th colSpan="6" className="header-cell">
                            Evaluations
                        </th>
                        <th rowSpan="2" className="header-cell"  style={{borderTopRightRadius: "12px"}}>
                            Notation si <br></br>réalisé (sur 20)
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
                    <tr>
                        <td className="competence-cell" rowSpan="3"  style={{borderBottomLeftRadius: "12px"}}>
                            [Nom du bloc]
                        </td>
                        <td className="competence-cell">
                            <input type="" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="validation-cell">
                            <input type="text" placeholder="N/A" />
                        </td>
                    </tr>
                    <tr>
                        <td className="competence-cell">
                            <input type="" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="validation-cell">
                            <input type="text" placeholder="N/A" />
                        </td>
                    </tr>
                    <tr>
                        <td className="competence-cell">
                            <input type="" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="score-cell">
                            <input type="checkbox" />
                        </td>
                        <td className="validation-cell">
                            <input type="text" placeholder="N/A" />
                        </td>
                    </tr>
                    <tr>
                        <td colSpan="8"></td>
                        <td className="competence-cell" style={{borderBottomLeftRadius: "12px", borderBottomRightRadius: "12px"}}>N/A</td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default GrilleEvaluationLivret;
