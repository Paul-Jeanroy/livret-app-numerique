/* 
    composant Footer.jsx
    Créer le 08/06 par PJ
    
*/
import useMenuSelect from "../hooks/useMenuSelect";
import { useUserRole } from "../hooks/useUserRole";
import "../styles/Footer.css";

export default function Footer() {
    const { menuSelect, setMenuSelect } = useMenuSelect();
    const { roleUser } = useUserRole();

    return (
        <footer className="footer">
            <div className="div_container_footer">
                <h3 className="h3_titre_site">Livret d'apprentissage numérique</h3>
                <div className="div_nav_footer">
                    <nav className="nav_footer">

                        <div className="div_nav_accueil_footer">
                            <a href={"/accueil"}>Accueil</a>
                        </div>
                        <div className="div_nav_profil">
                            <a href={"/profil"}>Profil</a>
                        </div>

                        {roleUser == "coordinateur" && (
                            <>
                                <div className="div_nav_profil">
                                    <a href={"/gestionUtilisateur"} onClick={() => setMenuSelect("gestionUtilisateur")} className={menuSelect == "gestionUtilisateur" ? "selected" : ""}>Gestion Utilisateur</a>
                                </div>

                                <div className="div_nav_profil">
                                    <a href={"/gestionLivret"} onClick={() => setMenuSelect("gestionLivret")} className={menuSelect == "gestionLivret" ? "selected" : ""}>Gestion Livret</a>
                                </div>

                                <div className="div_nav_profil">
                                    <a href={"/gestionFormation"} onClick={() => setMenuSelect("gestionFormation")} className={menuSelect == "gestionFormation" ? "selected" : ""}>Gestion Formation</a>
                                </div>

                                <div className="div_nav_profil">
                                    <a href={"/creationTitre"} onClick={() => setMenuSelect("creationTitre")} className={menuSelect == "gestionLivret" ? "selected" : ""}>Créér un Titre</a>
                                </div>

                            </>
                        )}

                        {(roleUser == "apprenti" || roleUser == "maître d'apprentissage") && (
                            <div className="div_nav_livret_footer">
                                <a href={"/livret"} onClick={() => setMenuSelect("livret")} className={menuSelect == "livret" ? "selected" : ""}>Livret</a>
                            </div>
                        )}

                    </nav>
                </div>
                <div className="div_pub_footer">
                    <div className="div_realisation">@2024 Laib - Jeanroy</div>
                    <div className="div_pub">
                        <img src="/region-sud.png"></img>
                        <img src="/ecole-pratique.png"></img>
                        <img src="/cci-aix-mars.png"></img>
                        <img src="/logo-esiee.png"></img>
                    </div>
                </div>
            </div>
        </footer>
    );
}
