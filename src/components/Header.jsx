/* 
    composant Header.jsx
    Créer le 08/06 par PJ

    Fonctionnalités :
    - ...
*/

"use client";

import { useState } from "react";
import "../styles/Header.css";
import PopupNotification from "./PopupNotification";
import useMenuSelect from "../hooks/useMenuSelect";

export default function Header() {
    const [f_openNotif, setOpenNotif] = useState(false);
    const { menuSelect, setMenuSelect } = useMenuSelect();

    return (
        <>
            <header>
                <div className="div_container_header">
                    <h1 className="h1_titre_site">Livret d'Apprentissage Numérique</h1>
                    <div className="div_nav_header">
                        <nav className="nav_header">
                            <div className="div_nav_accueil">
                                <img src="/home.svg"></img>
                                <a href={"/accueil"} onClick={() => setMenuSelect("accueil")} className={menuSelect == "accueil" ? "selected" : ""}>
                                    Accueil
                                </a>
                            </div>
                            <div className="div_nav_livret">
                                <img src="/livret.svg"></img>
                                <a href={"/livret"} onClick={() => setMenuSelect("livret")} className={menuSelect == "livret" ? "selected" : ""}>
                                    Livret
                                </a>
                            </div>
                            <div className="div_nav_profil">
                                <img src="/user.svg"></img>
                                <a href={"/profil"} onClick={() => setMenuSelect("profil")} className={menuSelect == "profil" ? "selected" : ""}>
                                    Profil
                                </a>
                            </div>
                        </nav>
                        <button className="btn_notif" onClick={() => setOpenNotif(true)}>
                            <img src="/icon-notif.png"></img>
                        </button>
                        <button className="btn_deco">
                            <a href={"/Connexion"}>Se déconnecter</a>
                        </button>
                    </div>
                </div>
            </header>

            {/* Popup notification */}
            {f_openNotif && <PopupNotification setOpenNotif={setOpenNotif} />}
        </>
    );
}
