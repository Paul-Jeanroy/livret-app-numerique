/* 
    composant Header.jsx
    Créer le 08/06 par PJ

    Fonctionnalités :
    - ...
*/

"use client"

import "../styles/Header.css"

export default function Header(){

    return(
        <header>
            <div className="div_container_header">
                <h1 className="h1_titre_site">Livret d'Apprentissage Numérique</h1>
                <div className="div_nav_header">
                    <nav className="nav_header">
                        <div className="div_nav_acceuil">
                            <img src="/icon-accueil.png"></img>
                            <a href={"/accueil"}>Accueil</a>
                        </div>
                        <div className="div_nav_livret">
                            <img src="/icon-livret.png"></img>
                            <a href={"/livret"}>Livret</a>
                        </div>
                        <div className="div_nav_profil">
                            <div className="div_contour_avatar">
                                <img src="/icon-avatar.png"></img>
                            </div>
                            <a href={"/profil"}>Profil</a>
                        </div>
                    </nav>
                    <button className="btn_notif">
                        <img src="/icon-notif.png"></img>
                    </button>
                    <button className="btn_deco">
                        <a href={"/Connexion"}>Se déconnecter</a>
                    </button>
                </div>
            </div>
        </header>
);
}
