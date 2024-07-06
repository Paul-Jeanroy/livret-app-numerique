/* Composant ContainerBlocCompetences.jsx : Permet l'affichages des blocs et des compétences d'une formation

    Fait par Paul Jeanroy

    Fonctionnalités :
    - sp_modifier_periode_formation : Permet de changer la période (semestre/trimestre) du livret de formation
    - sp_ouvrir_opoup_modification : Permet d'ouvrir la popup de modification de bloc ou de compétence
    - sp_valider_modification : Permet de sauvegarder les modifications apportées dans la popup de modification

*/


// Import de composants
import Footer from "../components/Footer";
import Header from "../components/Header";
import Loader from "../components/Loader";
import PopupModifierFormation from "../components/PopupModifierFormation";

// Import de hooks peronnalisés.
import { useUserRole } from "../hooks/useUserRole";
import useFormationData from "../hooks/useFormationData";

// Import CSS
import '../styles/gestionFormation.css';

// Import REACT
import { useState, useEffect } from "react";

// Import externe
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';



export default function GestionFormation() {
    const { userId } = useUserRole();
    const [f_container_visible, setContainerVisible] = useState(false);
    const [f_open_popup, setOpenPopup] = useState(false);
    const [w_periode_select, setPeriodeSelect] = useState("");
    const [w_type_donnee, setTypeDonnee] = useState(""); // Le type veut dire soit bloc soit competence
    const [o_initiale_donnee, setInitialDonnee] = useState({ id: null, nom: "", description: "" });
    const { formationData, loading, setFormationData } = useFormationData(userId);


    useEffect(() => {
        if (formationData && formationData.formation && formationData.formation.periode) {
            setPeriodeSelect(formationData.formation.periode);
        }
    }, [formationData]);


    const sp_modifier_periode_formation = async (e) => {
        const w_nouvelle_periode = e.target.value;
        setPeriodeSelect(w_nouvelle_periode);
        try {
            const response = await axios.post('http://localhost:5000/formation/setPeriodeLivret', { user_id: userId, periode: w_nouvelle_periode });
        } catch (error) {
           toast.error("Oups, erreur lors de la modification de la période d'une formation.");
        }
    };


    const sp_ouvrir_opoup_modification = (w_type, o_tt_donnee) => {
        setTypeDonnee(w_type);
        setInitialDonnee(o_tt_donnee);
        setOpenPopup(true);
    };

    
    const sp_valider_modification = async (o_donnee_modif) => {
        try {
            const w_fonction_modif = w_type_donnee === 'bloc' ? 'updateBloc' : 'updateCompetence';
            const response = await axios.post(`http://localhost:5000/formation/${w_fonction_modif}`, { [w_type_donnee]: o_donnee_modif });

            setFormationData(o_donnees_formation => {
                const o_tt_donnees_blocs = Array.isArray(o_donnees_formation.blocs) ? o_donnees_formation.blocs : Object.values(o_donnees_formation.blocs);
                if (w_type_donnee === 'bloc') {
                    const o_tt_nouvelle_donnees_bloc = o_tt_donnees_blocs.map(bloc => bloc.id === o_donnee_modif.id ? o_donnee_modif : bloc);
                    return { ...o_donnees_formation, blocs: o_tt_nouvelle_donnees_bloc };
                } else {
                    const o_tt_nouvelle_donnees_bloc = o_tt_donnees_blocs.map(bloc => {
                        if (bloc.competences.some(comp => comp.id === o_donnee_modif.id)) {
                            const newCompetences = bloc.competences.map(comp => comp.id === o_donnee_modif.id ? o_donnee_modif : comp);
                            return { ...bloc, competences: newCompetences };
                        }
                        return bloc;
                    });
                    return { ...o_donnees_formation, blocs: o_tt_nouvelle_donnees_bloc };
                }
            });
        } catch (error) {
            toast.error(`Oups, il y à une erreur lors de la modification ${w_type_donnee === "bloc" ? "d'un bloc" : "d'une compétence"}`);
        }
    };

    return (
        <>
            <Header />
            <ToastContainer position="top-right" autoClose={10000} />
            <main className="main_gestion_formation">
                <h1 className="titre_page">Gestion de formation</h1>
                {loading && <Loader />}
                <div className="div_container_formation" style={{
                    height: f_container_visible ? "100%" : "180px",
                    overflow: "hidden",
                }}>
                    {formationData && formationData.formation && (
                        <div className="div_header_info_formation">
                            <img
                                className="img_manage_bloc_info_formation"
                                onClick={() => setContainerVisible(!f_container_visible)}
                                src="/icon-chevron.png"
                                alt="Gérer section"
                                style={{
                                    transform: f_container_visible ? "rotate(180deg)" : "rotate(0deg)",
                                    transition: "transform 0.3s ease",
                                    alignItems: "end"
                                }}
                            />
                            <div className="div_info_formation">
                                <h2>{formationData.formation.nom}</h2>
                                <p>Code RNCP: {formationData.formation.code_rncp}</p>
                                <p>Niveau: {formationData.formation.niveau}</p>
                                <select value={w_periode_select} onChange={sp_modifier_periode_formation}>
                                    <option value="Trimestre">Trimestre</option>
                                    <option value="Semestre">Semestre</option>
                                </select>
                            </div>
                        </div>
                    )}

                    {formationData?.blocs.length > 1 ? (
                        <div className="div_container_bloc_comp">
                            {Object.values(formationData.blocs).map((bloc, blocIndex) => (
                                <div key={blocIndex} className="div_bloc">
                                    <h2>
                                        {bloc.nom}
                                        <img
                                            src="/pencil-edit.svg"
                                            alt="Modifier"
                                            style={{cursor: "pointer"}}
                                            onClick={() => sp_ouvrir_opoup_modification('bloc', { ...bloc, id: bloc.id })}
                                        />
                                    </h2>
                                    <div className="div_texte_bloc">
                                        {bloc.description}
                                    </div>
                                    {bloc.competences && bloc.competences.length > 0 && (
                                        bloc.competences.map((competence, index) => (
                                            <div key={index}>
                                                <p className='div_titre_competence'>
                                                    {competence.nom}
                                                    <img
                                                        src="/pencil-edit.svg"
                                                        alt="Edit"
                                                        style={{cursor: "pointer"}}
                                                        onClick={() => sp_ouvrir_opoup_modification('competence', competence)}
                                                    />
                                                </p>
                                                <div className="div_texte_competence">
                                                    {competence.description}
                                                </div>
                                            </div>
                                        ))
                                    )}
                                </div>
                            ))}
                        </div>
                    ) : <div style={{display: "flex", justifyContent: "center", alignItem: "center", textAlign: "center", marginBottom: "10px", color: "black", fontWeight: "bold"}}>Aucune données pour cette formation</div>}
                </div>
            </main>
            <Footer />
            <PopupModifierFormation
                f_open_popup={f_open_popup}
                onClose={() => setOpenPopup(false)}
                o_initiale_donnee={o_initiale_donnee}
                onSave={sp_valider_modification}
            />
        </>
    );
}
