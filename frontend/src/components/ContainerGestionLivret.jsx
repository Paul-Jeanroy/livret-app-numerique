/*  composant ContainerGestionLivret.jsx : permet l'affichage des utilisateurs d'une formation page de gestion des livrets
    
    Par Paul Jeanroy

    Aucune fonctionnalité.
    
*/

// IMPORT REACT 
import { useState } from "react";

// IMPORT CSS
import "../styles/ContainerGestionLivret.css";


export default function ContainerGestionLivret({ annee, users }) {
    const [f_containerVisible, setContainerVisible] = useState(true);

    return (
        <main className="main_container_suivi_livret"
            style={{
                height: f_containerVisible ? "auto" : "50px",
                overflow: "hidden",
            }}
        >
            <div className="div_header_suivi_livret">
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
                <div className="div_body_suivi_livret">
                    {users.map((user, index) => (
                        <div key={index} className="div_ligne_suivi_livret">
                            <div className="div_nom_livret">
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
