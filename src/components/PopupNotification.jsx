import  { useEffect, useRef } from "react";
import "../styles/PopupNotification.css";

export default function PopupNotification({ setOpenNotif }) {
    const popupNotifRef = useRef(null);

    useEffect(() => {
        function handleClickOutside(event) {
            if (popupNotifRef.current && !popupNotifRef.current.contains(event.target)) {
                setOpenNotif(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
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
