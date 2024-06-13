/* 
    composant Footer.jsx
    Créer le 08/06 par PJ

    Fonctionnalités :
    - ...
    
*/
import "../styles/Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="div_container_footer">
                <h3 className="h3_titre_site">Livret d'apprentissage numérique</h3>
                <div className="div_nav_footer">
                    <nav className="nav_footer">
                        <div className="div_nav_accueil_footer">
                            <a href={"/accueil"}>Accueil</a>
                        </div>
                        <div className="div_nav_livret">
                            <a href={"/livret"}>Livret</a>
                        </div>
                        <div className="div_nav_profil">
                            <a href={"/profil"}>Profil</a>
                        </div>
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
