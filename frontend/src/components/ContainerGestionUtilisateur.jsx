import { useState } from "react";
import "../styles/ContainerGestionUtilisateur.css";

import PopupAjouterUser from "./PopupAjouterUser";
import PopupModifierUser from "./PopupModifierUser";
import PopupConfirmDeleteUser from "./PopupConfirmDeleteUser";

export default function ContainerGestionUtilisateur(props) {
    const [f_addNewUser, setAddNewUser] = useState(false);
    const [f_modifUser, setModifUser] = useState(false);
    const [f_deleteUser, setDeleteUser] = useState(false);
    const [f_containerVisible, setContainerVisible] = useState(true);

    return (
        <>
            <main
                className="main-container-suivi-utilisateur"
                style={{
                    height: f_containerVisible ? "auto" : "50px",
                    overflow: "hidden",
                }}
            >
                <div className="div-header-suivi-utilisateur">
                    <h1>{props.annee}</h1>
                    <img className="img-add-user" onClick={() => setAddNewUser(true)} src="/add.svg" alt="Ajouter utilisateur" />
                    <img
                        className="img-manage-section"
                        onClick={() => setContainerVisible(!f_containerVisible)}
                        src="/icon-chevron.png"
                        alt="Gérer section"
                        style={{
                            transform: f_containerVisible ? "rotate(180deg)" : "rotate(0deg)",
                            transition: "transform 0.3s ease",
                        }}
                    />
                </div>
                {f_containerVisible && (
                    <div className="container-suivi-utilisateur">
                        {props.data.map((item, index) => (
                            <div key={index} className="div-ligne-suivi-utilisateur">
                                <div className="div-nom-utilisateur">
                                    <p>{item.nom}</p>
                                    <p>{item.prenom}</p>
                                </div>
                                <img className="img-modif" src="/icon-chevron.png" alt="Détails utilisateur" onClick={() => setModifUser(true)}/>
                                <img className="img-suppr" onClick={() => setDeleteUser(true)} src="/delete.svg" alt="supprimer utilisateur"/>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {f_addNewUser && <PopupAjouterUser setAddNewUser={setAddNewUser} />}
            {f_modifUser && <PopupModifierUser setModifUser={setModifUser} />}
            {f_deleteUser && <PopupConfirmDeleteUser setDeleteUser={setDeleteUser} />}
        </>
    );
}
