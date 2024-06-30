/* 
    composant Header.jsx
    Créer le 08/06 par PJ

    Fonctionnalités :
    - sp_deconnexion : Permet de se déconnecter
*/

import { useState } from "react";
import "../styles/Header.css";
import PopupNotification from "./PopupNotification";
import useMenuSelect from "../hooks/useMenuSelect";
import { useUserRole } from "../hooks/useUserRole";
import { useNavigate } from "react-router-dom";

export default function Header() {
    const [f_openNotif, setOpenNotif] = useState(false);
    const { menuSelect, setMenuSelect } = useMenuSelect();
    const { roleUser } = useUserRole();
    const navigate = useNavigate();

    const sp_deconnexion = () => {
        localStorage.removeItem('roleUser');
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    }

    return (
        <>
            <header>
                <div className="div_container_header">
                    <h1 className="h1_titre_site">Livret d'Apprentissage Numérique</h1>
                    <div className="div_nav_header">
                        <nav className="nav_header">

                            <div className="div_nav_accueil">
                                <a href={"/accueil"} onClick={() => setMenuSelect("accueil")} className={menuSelect == "accueil" ? "selected" : ""}>Accueil</a>
                            </div>
                            <div className="div_nav_profil">
                                <a href={"/profil"} onClick={() => setMenuSelect("profil")} className={menuSelect == "profil" ? "selected" : ""}>Profil</a>
                            </div>

                            {roleUser == "coordinateur" && (
                                <>
                                    <div className="div_nav_profil">
                                        <a href={"/gestionUtilisateur"} onClick={() => setMenuSelect("gestionUtilisateur")} className={menuSelect == "gestionUtilisateur" ? "selected" : ""}>Gestion Utilisateur</a>
                                    </div>

                                    <div className="div_nav_profil">
                                        <a href={"/gestionLivret"} onClick={() => setMenuSelect("gestionLivret")} className={menuSelect == "gestionLivret" ? "selected" : ""}>Gestion Livret</a>
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
                        </nav>

                        {roleUser == "coordinateur" && (
                            <button className="btn_notif" onClick={() => navigate('/creationTitre')}>
                                <img src="/icon-add-titre.svg"></img>
                            </button>
                        )}
                        <button className="btn_notif" onClick={() => setOpenNotif(true)}>
                            <img src="/icon-notif.png"></img>
                        </button>
                        <button className="btn_deco">
                            <a href={"/Connexion"} onClick={() => sp_deconnexion()}>Se déconnecter</a>
                        </button>
                    </div>
                </div>
            </header>
            
            {f_openNotif && <PopupNotification setOpenNotif={setOpenNotif} />}
        </>
    );
}
