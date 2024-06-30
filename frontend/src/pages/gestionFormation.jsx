import Footer from "../components/Footer";
import Header from "../components/Header";
import Loader from "../components/Loader";
import { useUserRole } from "../hooks/useUserRole";
import useFormationData from "../hooks/useFormationData";

import '../styles/containerBlocCompetences.css';
import '../styles/gestionFormation.css';
import { useState, useEffect } from "react";
import axios from "axios";

export default function gestionFormation() {
    const { userId } = useUserRole();
    const [f_containerVisible, setContainerVisible] = useState(false);
    const { formationData, loading, error } = useFormationData(userId);
    const [selectedPeriod, setSelectedPeriod] = useState('');

    useEffect(() => {
        if (formationData && formationData.formation && formationData.formation.periode) {
            setSelectedPeriod(formationData.formation.periode);
        }
    }, [formationData]);

    const handlePeriodChange = async (e) => {
        const newPeriode = e.target.value;
        setSelectedPeriod(newPeriode);

        try {
            const response = await axios.post('http://localhost:5000/formation/setPeriodeLivret', { user_id: userId, periode: newPeriode });
            console.log(response.data);
        } catch (error) {
            console.error('Error updating period:', error);
        }
    };

    return (
        <>
            <Header />
            <main className="container-gestion-formation">
                <h1 className="titre_page">Gestion de formation</h1>
                {loading && <Loader />}
                {error && <p>Error: {error}</p>}
                <div className="div-container-formation" style={{
                    height: f_containerVisible ? "100%" : "180px",
                    overflow: "hidden",
                }}>
                    {formationData && formationData.formation && (
                        <div className="container-gestion-info-formation">
                            <img
                                className="img-manage-formation"
                                onClick={() => setContainerVisible(!f_containerVisible)}
                                src="/icon-chevron.png"
                                alt="Gérer section"
                                style={{
                                    transform: f_containerVisible ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.3s ease",
                                    alignItems: "end"
                                }}
                            />
                            <div className="detail-formation">
                                <h2>{formationData.formation.nom}</h2>
                                <p>Code RNCP: {formationData.formation.code_rncp}</p>
                                <p>Niveau: {formationData.formation.niveau}</p>
                                <select value={selectedPeriod} onChange={handlePeriodChange}>
                                    <option value="Trimestre">Trimestre</option>
                                    <option value="Semestre">Semestre</option>
                                </select>
                            </div>
                        </div>
                    )}
                    {formationData && formationData.blocs && (
                        <div className="bloc-competences-container">
                            {Object.values(formationData.blocs).map((bloc, blocIndex) => (
                                <div key={blocIndex} className="bloc">
                                    <h2 className="h2-bloc">
                                        {bloc.nom}
                                    </h2>
                                    <div className="div-bloc">
                                        {bloc.description}
                                    </div>
                                    {bloc.competences && bloc.competences.length > 0 && (
                                        bloc.competences.map((competence, compIndex) => (
                                            <div key={compIndex} className="competences">
                                                <p className='titre-competence'>
                                                    {competence.nom}
                                                </p>
                                                <div className="competence">
                                                    {competence.description}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}
