import { useState } from "react";
import "../styles/ContainerGestionUtilisateur.css";
import PopupAjouterUser from "./PopupAjouterUser";
import PopupModifierUser from "./PopupModifierUser";
import PopupConfirmDeleteUser from "./PopupConfirmDeleteUser";

export default function ContainerGestionUtilisateur({ annee, users, onDeleteUser, onUpdateUser, onAddUser, fetchUsers }) { 
    const [f_modifUser, setModifUser] = useState(false);
    const [f_deleteUser, setDeleteUser] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);
    const [f_addNewUser, setAddNewUser] = useState(false);
    const [f_containerVisible, setContainerVisible] = useState(true);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleUpdateUser = (updatedUser) => {
        onUpdateUser(updatedUser);
        setModifUser(false);
    };

    return (
        <>
            <main
                className="main-container-suivi-utilisateur"
                style={{
                    height: f_containerVisible ? "100%" : "50px",
                    overflow: "hidden",
                }}
            >
                <div className="div-header-suivi-utilisateur">
                    <h1>{annee}</h1>
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
                        {users.length > 0 ? (
                            users.map((user, index) => (
                                user.id_user !== null ? (
                                    <div key={index} className="div-ligne-suivi-utilisateur">
                                        <div className="div-nom-utilisateur">
                                            <p>{user.nom}</p>
                                            <p>{user.prenom}</p>
                                        </div>
                                        <img className="img-modif" src="/icon-chevron.png" alt="Détails utilisateur" onClick={() => {setModifUser(true); setSelectedUser(user);}} />
                                        <img className="img-suppr" onClick={() => onDeleteUser(user)} src="/delete.svg" alt="supprimer utilisateur" />
                                    </div>
                                ) : (
                                    <div key={index} className="div-ligne-suivi-utilisateur">
                                        <div className="div-nom-utilisateur">
                                            <p>Aucun utilisateur</p>
                                        </div>
                                    </div>
                                )
                            ))
                        ) : (
                            <div className="div-ligne-suivi-utilisateur" style={{cursor: "normal !important"}}>
                                <div className="div-nom-utilisateur">
                                    <p>Aucun utilisateur</p>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>

            {f_addNewUser && <PopupAjouterUser setAddNewUser={setAddNewUser} annee={annee} onAddUser={onAddUser} />}
            {f_modifUser && <PopupModifierUser setModifUser={setModifUser} user={selectedUser} onUpdateUser={handleUpdateUser} fetchUsers={fetchUsers}/>}
            {f_deleteUser && <PopupConfirmDeleteUser setDeleteUser={setDeleteUser} />}
        </>
    );
}
