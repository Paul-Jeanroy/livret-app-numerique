/* 
    composant ContainerGestionLivret.jsx
    Créer le 08/06 par PJ
*/

import { useState } from "react";
import "../styles/ContainerGestionLivret.css";

export default function ContainerGestionLivret({ annee, users }) {
    const [f_containerVisible, setContainerVisible] = useState(true);

    return (
        <main
            className="main-container-suivi-livret"
            style={{
                height: f_containerVisible ? "auto" : "50px",
                overflow: "hidden",
            }}
        >
            <div className="div-header-suivi-livret">
                <h1>{annee}</h1>
                <img
                    src="/icon-chevron.png"
                    onClick={() => setContainerVisible(!f_containerVisible)}
                    alt="Gérer section"
                    style={{
                        transform: f_containerVisible ? "rotate(180deg)" : "rotate(0deg)",
                        transition: "transform 0.3s ease",
                    }}
                />
            </div>
            {f_containerVisible && (
                <div className="container-suivi-livret">
                    {users.map((user, index) => (
                        <div key={index} className="div-ligne-suivi-livret">
                            <div className="div-nom-livret">
                                <p>{user.nom}</p>
                                <p>{user.prenom}</p>
                            </div>
                            <img src="/icon-chevron.png" />
                        </div>
                    ))}
                </div>
            )}
        </main>
    );
}
