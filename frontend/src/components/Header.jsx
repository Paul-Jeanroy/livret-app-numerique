/* Composant Header.jsx : Composant Header
    
    Par Paul Jeanroy

    Fonctionnalités :
    - sp_deconnexion : Permet de se déconnecter.
    - sp_gerer_menu_hamburger : Permet d'ouvrir ou de fermer le menu hamburger.

*/

// Import REACT
import { useState } from "react";
import { useNavigate } from "react-router-dom";

// Import CSS
import "../styles/Header.css";

// Import des composants
import PopupNotification from "./PopupNotification";

// Import hooks personnalisés
import useMenuSelect from "../hooks/useMenuSelect";
import { useUserRole } from "../hooks/useUserRole";


export default function Header() {
    const [f_openNotif, setOpenNotif] = useState(false);
    const [f_hamburger_menu, setHamburgerMenu] = useState(false);
    const { menuSelect, setMenuSelect } = useMenuSelect();
    const { roleUser } = useUserRole();
    const navigate = useNavigate();

    const sp_deconnexion = () => {
        localStorage.removeItem('roleUser');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    }

    const sp_gerer_menu_hamburger = () => {
        setHamburgerMenu(!f_hamburger_menu);
    }

    return (
        <>
            <header>
                <div className="div_container_header">
                    <h1 className="h1_titre_site">Livret d'Apprentissage Numérique</h1>
                    <div className="div_nav_header">
                        <button className="btn_hamburger_menu" onClick={sp_gerer_menu_hamburger}>
                            {f_hamburger_menu ? (
                                <span className="icon_hamburger_menu">X</span>
                            ) : (
                                <span className="icon_hamburger_menu">&#9776;</span>
                            )}
                        </button>
                        <nav className={`nav_header ${f_hamburger_menu ? 'ouvert' : ''}`}>
                            <div className="div_nav">
                                <a href={"/accueil"} onClick={() => setMenuSelect("accueil")} className={menuSelect == "accueil" ? "selected" : ""}>Accueil</a>
                            </div>
                            <div className="div_nav">
                                <a href={"/profil"} onClick={() => setMenuSelect("profil")} className={menuSelect == "profil" ? "selected" : ""}>Profil</a>
                            </div>

                            {roleUser == "coordinateur" && (
                                <>
                                    <div className="div_nav">
                                        <a href={"/gestionUtilisateur"} onClick={() => setMenuSelect("gestionUtilisateur")} className={menuSelect == "gestionUtilisateur" ? "selected" : ""}>Gestion Utilisateur</a>
                                    </div>

                                    <div className="div_nav">
                                        <a href={"/gestionLivret"} onClick={() => setMenuSelect("gestionLivret")} className={menuSelect == "gestionLivret" ? "selected" : ""}>Gestion Livret</a>
                                    </div>

                                    <div className="div_nav">
                                        <a href={"/gestionFormation"} onClick={() => setMenuSelect("gestionFormation")} className={menuSelect == "gestionFormation" ? "selected" : ""}>Gestion Formation</a>
                                    </div>
                                </>
                            )}

                            {(roleUser == "apprenti" || roleUser == "maître d'apprentissage") && (
                                <>
                                    <div className="div_nav_livret">
                                        <a href={"/livret"} onClick={() => setMenuSelect("livret")} className={menuSelect == "livret" ? "selected" : ""}>Livret</a>
                                    </div>
                                </>
                            )}

                            {roleUser == "coordinateur" && (
                                <button className="btn_notif" onClick={() => navigate('/creationTitre')}>
                                    <img src="/icon-add-titre.svg" alt="Ajouter Titre" />
                                </button>
                            )}
                            <button className="btn_deco">
                                <a href={"/Connexion"} onClick={() => sp_deconnexion()}>Se déconnecter</a>
                            </button>
                        </nav>
                    </div>
                </div>
            </header>

            {f_openNotif && <PopupNotification setOpenNotif={setOpenNotif} />}
        </>
    );
}
