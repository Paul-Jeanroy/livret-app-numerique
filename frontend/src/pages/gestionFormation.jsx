import Footer from "../components/Footer";
import Header from "../components/Header";
import Loader from "../components/Loader";
import PopupModifierFormation from "../components/PopupModifierFormation";
import { useUserRole } from "../hooks/useUserRole";
import useFormationData from "../hooks/useFormationData";

import '../styles/containerBlocCompetences.css';
import '../styles/gestionFormation.css';
import { useState, useEffect } from "react";
import axios from "axios";

export default function GestionFormation() {
    const { userId } = useUserRole();
    const [f_containerVisible, setContainerVisible] = useState(false);
    const { formationData, loading, error, setFormationData } = useFormationData(userId);
    const [selectedPeriod, setSelectedPeriod] = useState('');
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [currentEditData, setCurrentEditData] = useState({ id: null, nom: "", description: "" });
    const [editType, setEditType] = useState(''); // 'bloc' or 'competence'

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

    const handleEditClick = (type, data) => {
        console.log("Editing data:", data); // Debug line
        setEditType(type);
        setCurrentEditData(data);
        setIsPopupOpen(true);
    };

    const handleSave = async (updatedData) => {
        try {
            const endpoint = editType === 'bloc' ? 'updateBloc' : 'updateCompetence';
            console.log(`Sending data to endpoint /formation/${endpoint}:`, { [editType]: updatedData });
            const response = await axios.post(`http://localhost:5000/formation/${endpoint}`, { [editType]: updatedData });
            console.log(response.data);

            setFormationData(prevData => {
                const blocsArray = Array.isArray(prevData.blocs) ? prevData.blocs : Object.values(prevData.blocs);

                if (editType === 'bloc') {
                    const newBlocs = blocsArray.map(bloc => bloc.id === updatedData.id ? updatedData : bloc);
                    return { ...prevData, blocs: newBlocs };
                } else {
                    const newBlocs = blocsArray.map(bloc => {
                        if (bloc.competences.some(comp => comp.id === updatedData.id)) {
                            const newCompetences = bloc.competences.map(comp => comp.id === updatedData.id ? updatedData : comp);
                            return { ...bloc, competences: newCompetences };
                        }
                        return bloc;
                    });
                    return { ...prevData, blocs: newBlocs };
                }
            });
        } catch (error) {
            console.error('Error updating data:', error);
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
                                        <img 
                                            src="/pencil-edit.svg" 
                                            alt="Edit" 
                                            className="edit-icon" 
                                            onClick={() => handleEditClick('bloc', { ...bloc, id: bloc.id })} 
                                        />
                                    </h2>
                                    <div className="div-bloc">
                                        {bloc.description}
                                    </div>
                                    {bloc.competences && bloc.competences.length > 0 && (
                                        bloc.competences.map((competence, compIndex) => (
                                            <div key={compIndex} className="competences">
                                                <p className='titre-competence'>
                                                    {competence.nom}
                                                    <img 
                                                        src="/pencil-edit.svg" 
                                                        alt="Edit" 
                                                        className="edit-icon" 
                                                        onClick={() => handleEditClick('competence', competence)} 
                                                    />
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
            <PopupModifierFormation 
                isOpen={isPopupOpen} 
                onClose={() => setIsPopupOpen(false)} 
                initialData={currentEditData} 
                onSave={handleSave} 
            />
        </>
    );
}
