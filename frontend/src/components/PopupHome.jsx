/* Composant PopupHome.jsx
    
    Par Paul Jeanroy

    Fonctionnalité :
    - sp_detect_clique_outside : fonction qui permet de détecter un cliquer user en dehors de la popup pour la fermer
    
*/

// Import REACT
import { useEffect, useRef } from "react";

// Import CSS
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
        <main className="main_container_popup_home">
            <div className="div_container_popup_home" ref={popupHomeRef}>
                <div className="header_popup_home">
                    <h1>Avantages du livret d'apprentissage numérique</h1>
                    <img onClick={() => setOpenPopupHome(false)} src="/icon-croix.png" alt="icone Homeication" />
                </div>
                <ul>
                    <li>
                        <img src="/icon-fleche.png" />
                        <span>Améliore la collaboration : </span> Facilite la communication et le suivi entre l'apprenti, l'entreprise et l'école.
                    </li>
                    <li>
                        <img src="/icon-fleche.png" />
                        <span>Personnalisation facile : </span> S'adapte facilement aux différents référentiels des filières.
                    </li>
                    <li>
                        <img src="/icon-fleche.png" />
                        <span>Gestion simplifiée : </span> Réduit la complexité et les lourdeurs associées à la gestion des livrets papier et Excel.
                    </li>
                    <li>
                        <img src="/icon-fleche.png" />
                        <span>Suivi précis des missions : </span> Permet à l'apprenti d'indiquer les missions attribuées et les points appris à l'école.
                    </li>
                </ul>
            </div>
        </main>
    );
}
