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
        <h1 className="div_titre_site">Livret Numérique test test test</h1>
        <nav className="nav-links">
            <div className="nav-item">
                <img src="/icon-accueil.png" alt="Accueil" className="accueil-image" />
                <a href="/accueil" className="nav-link no-border">Accueil</a>
            </div>
            <div className="nav-item">
                <img src="/icon-livret.png" alt="Livret" className="livret-image" />
                <a href="/livret" className="nav-link no-border">Livret</a>
            </div>
            <div className="nav-item">
                <img src="/avatar.png" alt="Profile" className="profile-image" />
                <a href="/profil" className="nav-link">Profil</a>
            </div>
            <a href="/notifications" className="nav-item">
                <img src="/icon-notif.png" alt="Notifications" className="notification-image" />
            </a>
            <button type="button" className="nav-button">Se Déconnecter</button>
        </nav>
    </header>
);
}
