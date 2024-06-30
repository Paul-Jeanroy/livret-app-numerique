import React, { useEffect, useState } from 'react';
import '../styles/containerBlocCompetences.css';

export default function ContainerBlocCompetences({ data }) {
    const [shortenedCompetences, setShortenedCompetences] = useState({});

    useEffect(() => {
        const fetchShortenedCompetences = async () => {
            for (const [blocTitle, blocData] of Object.entries(data)) {
                if (blocData.competences && blocData.competences.length > 0) {
                    try {
                        const response = await fetch('http://localhost:5000/livret/raccourcie-comp-ai', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({ competences: blocData.competences }),
                        });

                        if (!response.ok) {
                            throw new Error(`HTTP error! status: ${response.status}`);
                        }

                        const responseData = await response.json();
                        setShortenedCompetences(prev => ({
                            ...prev,
                            [blocTitle]: responseData.shortened_competences,
                        }));
                    } catch (error) {
                        console.error('Error fetching shortened competences:', error);
                    }
                }
            }
        };

        fetchShortenedCompetences();
    }, [data]);

    const getTruncatedBlocText = (blocText) => {
        const match = blocText.match(/BLOC \d+ [\-–] ([^-–]*?)(A\d+)/);
        if (match) {
            return match[1].trim();
        }
        return blocText;
    };

    const getTruncatedBlocTitle = (blocText) => {
        const match = blocText.match(/BLOC \d+/);
        if (match) {
            return match[0];
        }
        return blocText;
    };

    return (
        <div className="bloc-competences-container">
            {Object.entries(data).map(([blocTitle, blocData], index) => (
                <div key={index} className="bloc">
                    <h2 className="h2-bloc">{getTruncatedBlocTitle(blocTitle)}</h2>
                    <div className="div-bloc">{getTruncatedBlocText(blocData.bloc)}</div>
                    {blocData.competences && blocData.competences.length > 0 && (
                        <div className="competences">
                            {shortenedCompetences[blocTitle] ? (
                                shortenedCompetences[blocTitle].slice().reverse().map((competencePair, index) => (
                                    <div key={index} className="competence">
                                        <p><strong>Original:</strong> {competencePair.original}</p>
                                        <p><strong>Raccourcie:</strong> {competencePair.raccourcie}</p>
                                        <div className='img-proposition-ia'>
                                            <img src="annuler-2.png" alt="annuler"/>
                                            <img src="/valider-1.png" alt="valider"/>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>Loading...</p>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
