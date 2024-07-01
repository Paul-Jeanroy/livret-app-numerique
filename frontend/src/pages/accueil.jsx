import { useNavigate } from "react-router-dom";
import { useState } from "react";

import Footer from "../components/Footer";
import Header from "../components/Header";
import PopupHome from "../components/PopupHome";
import {useUserRole} from "../hooks/useUserRole"

import "../styles/accueil.css";

export default function Accueil() {
    const navigate = useNavigate()
    const [f_openPopupHome, setOpenPopupHome] = useState(false)
    const { roleUser } = useUserRole()
    console.log(roleUser);

    return (
        <>
            <Header />
            <div className="content-wrap">
                <main className="main-home" style={{ overflowY: f_openPopupHome ? "none" : "" }}>
                    <section id="section-home-1">
                        <div className="overlay"></div>
                        <img src="/background-image-home.png" alt="background image home" />
                        <div className="content">
                            <h1>Le livret qui vous accompagne.</h1>
                            <p>Votre parcours éducatif mérite un outil moderne et efficace...</p>
                            {roleUser === "coordinateur" ? (
                                    <button onClick={() => navigate('/gestionLivret')}>Gérer les livrets</button>
                                ) : roleUser === "apprenti" ? (
                                    <button onClick={() => navigate('/livret')}>Compléter votre livret</button>
                                ) : roleUser === "maître d'apprentissage" && (
                                    <button onClick={() => navigate('/livret')}>Compléter le livret</button>
                                )
                            }

                        </div>
                    </section>
                    <section id="section-home-2">
                        <div>
                            <img src="/foruser-image-home.png" />
                            <h1>Pour les Etudiants</h1>
                            <p>Un suivi de votre livret pour suivre vos progrès.</p>
                        </div>
                        <div>
                            <img src="/forschool-image.png" />
                            <h1>Pour les Ecoles</h1>
                            <p>Un suivi simple et efficace pour suivre les progrès de les élèves.</p>
                        </div>
                        <div>
                            <img src="/forcompagny-image.png" />
                            <h1>Pour les Entreprises</h1>
                            <p>Un suivi de votre livret pour suivre les alternants.</p>
                        </div>
                    </section>
                    <section id="section-home-3">
                        <div className="div-partie-gauche">
                            <h1>Facilitez, Organisez et Optimisez Votre Apprentissage</h1>
                            <p>Ce livret est un passeport d'apprentissage numérique qui aide les étudiants, les écoles et les entreprises à se connecter
                                et à échanger des informations plus facilement. Les écoles et les entreprises peuvent utiliser le livret numérique pour
                                obtenir une vue complète des notes obtenues, le suivi des comptences réalisé en entreprise, le tout en un seul endroit.
                                Il est ainsi plus facile pour les entreprises, les écoles et les étudiants de communiquer afin de s’assurer de la
                                réussite de l’éleve.</p>
                            <button onClick={() => setOpenPopupHome(true)}>En savoir plus</button>
                        </div>
                        <div className="div-partie-droite">
                            <img src="/entreprise.png" />
                        </div>
                    </section>
                </main>
                {f_openPopupHome && <PopupHome setOpenPopupHome={setOpenPopupHome} />}
                <Footer />
            </div>
        </>
    );
}
