/* 
    composant PopupHome.jsx
    Créer le 08/06 par PJ

    Fonctionnalité :
    - sp_detect_clique_outside : fonction qui permet de détecter un cliquer user en dehors de la popup pour la fermer
    - ...
    
*/

import { useEffect, useRef } from "react";
import "../styles/PopupHome.css";

export default function PopupHome({ setOpenPopupHome }) {
    const popupHomeRef = useRef(null);

    useEffect(() => {
        function sp_detect_clique_outside(event) {
            if (popupHomeRef.current && !popupHomeRef.current.contains(event.target)) {
                setOpenPopupHome(false);
            }
        }

        document.addEventListener("mousedown", sp_detect_clique_outside);

        return () => {
            document.removeEventListener("mousedown", sp_detect_clique_outside);
        };
    }, [setOpenPopupHome]);

    return (
        <main className="main-container-popup-home">
            <div className="div-container-popup-home" ref={popupHomeRef}>
                <div className="header-home">
                    <h1>Avantages du livret d'apprentissage numérique</h1>
                    <img onClick={() => setOpenPopupHome(false)} src="/icon-croix.png" alt="icone Homeication" />
                </div>
                <ul>
                    <li>
                        <img src="/icon-fleche.png"/>
                        <span>Améliore la collaboration : </span> Facilite la communication et le suivi entre l'apprenti, l'entreprise et l'école.
                    </li>
                    <li>
                        <img src="/icon-fleche.png"/>
                        <span>Personnalisation facile : </span> S'adapte facilement aux différents référentiels des filières.
                    </li>
                    <li>
                        <img src="/icon-fleche.png"/>
                        <span>Gestion simplifiée : </span> Réduit la complexité et les lourdeurs associées à la gestion des livrets papier et Excel.
                    </li>
                    <li>
                        <img src="/icon-fleche.png"/>
                        <span>Suivi précis des missions : </span> Permet à l'apprenti d'indiquer les missions attribuées et les points appris à l'école.
                    </li>
                </ul>
            </div>
        </main>
    );
}
