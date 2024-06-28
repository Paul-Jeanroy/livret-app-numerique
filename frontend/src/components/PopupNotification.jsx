
/* 
    composant popupNotification.jsx
    Créer le 08/06 par PJ-HL

    Fonctionnalité :
    - sp_detect_clique_outside : fonction qui permet de detecter un clique en dehors de la popup pour la fermer
    - ...
    
*/

import "../styles/PopupNotification.css";
import { useEffect, useRef } from "react";

export default function PopupNotification({ setOpenNotif }) {
    const popupNotifRef = useRef(null);

    useEffect(() => {
        function sp_detect_clique_outside(event) {
            if (popupNotifRef.current && !popupNotifRef.current.contains(event.target)) {
                setOpenNotif(false);
            }
        }

        document.addEventListener("mousedown", sp_detect_clique_outside);

        return () => {
            document.removeEventListener("mousedown", sp_detect_clique_outside);
        };
    }, [setOpenNotif]);

    return (
        <main className="main-container-popup-notif">
            <div className="div-container-popup-notif" ref={popupNotifRef}>
                <div className="header-notif">
                    <h1>Notification</h1>
                    <img onClick={() => setOpenNotif(false)} src="/icon-croix.png" alt="icone notification" />
                </div>
                <h2>
                    <span className="new-notif">Nouvelles Notifications</span>
                </h2>
                <p>Vous n'avez pas de nouvelles notifications</p>
                <h2>
                    <span>Anciennes Notifications</span>
                </h2>
                <p>Vous n'avez pas d'anciennes notifications</p>
            </div>
        </main>
    );
}
