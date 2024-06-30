import { useState, useEffect } from 'react';
import '../styles/containerBlocCompetences.css';
import axios from 'axios';
import { useUserRole } from '../hooks/useUserRole';

export default function ContainerBlocCompetences({ data }) {
    const [editedData, setEditedData] = useState({});
    const { userId } = useUserRole();

    useEffect(() => {
        setEditedData(data);
    }, [data]);

    const handleSubmit = async () => {
        try {
            console.log('Sending data:', { data: editedData, user_id: userId });
            const response = await axios.post('http://localhost:5000/formation/setBlocCompFormation', { data: editedData, user_id: userId });
            console.log(response.data);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    const getTruncatedBlocText = (blocText) => {
        let match = blocText.match(/(BLOC|Bloc) \d+ [\-–] ([^-–]*?)(A\d+)/);
        if (match) {
            return match[2].trim();
        }

        match = blocText.match(/(BLOC|Bloc) \d+ ?: ([^A]*?)(A\d+|$)/);
        if (match) {
            return match[2].trim();
        }

        return blocText;
    };

    const getTruncatedBlocTitle = (blocText) => {
        const match = blocText.match(/(BLOC|Bloc) \d+/);
        if (match) {
            return match[0];
        }
        return blocText;
    };

    const extractCompetenceNumber = (competence) => {
        const match = competence.match(/C(\d+([a-d]|\.\d+)?)/);
        if (match) {
            return match[1];
        }
        return null;
    };

    const sortCompetences = (competences) => {
        return competences.slice().sort((a, b) => {
            const numA = extractCompetenceNumber(a);
            const numB = extractCompetenceNumber(b);
            if (numA && numB) {
                return numA.localeCompare(numB, undefined, { numeric: true, sensitivity: 'base' });
            }
            return 0;
        });
    };

    const renderCompetenceTitle = (competence) => {
        const number = extractCompetenceNumber(competence);
        if (number) {
            return `compétence n°${number}`;
        }
        return "compétence";
    };

    const cleanCompetenceText = (competence) => {
        return competence.replace(/^C\d+(\.\d+|[a-zA-Z]?)?\s*-?\s*/, '').trim();
    };

    const hasBlocsAndCompetences = () => {
        return Object.keys(editedData).length > 0 && Object.values(editedData).some(bloc => bloc.competences && bloc.competences.length > 0);
    };

    return (
        <>
            <div className="bloc-competences-container">
                {Object.entries(data).map(([blocTitle, blocData], blocIndex) => (
                    <div key={blocIndex} className="bloc">
                        <h2 className="h2-bloc">
                            {getTruncatedBlocTitle(blocData.bloc)}
                        </h2>
                        <div className="div-bloc">
                            {getTruncatedBlocText(blocData.bloc)}
                        </div>
                        {blocData.competences && blocData.competences.length > 0 && (
                            sortCompetences(blocData.competences).map((competence, compIndex) => (
                                <div key={compIndex} className="competences">
                                    <p className='titre-competence'>
                                        {renderCompetenceTitle(competence)}
                                    </p>
                                    <div className="competence">
                                        {cleanCompetenceText(competence)}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                ))}
            </div>
            {hasBlocsAndCompetences() && (
                <button onClick={handleSubmit}>Valider la création du titre</button>
            )}
        </>
    );
}
