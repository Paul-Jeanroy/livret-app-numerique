/* composant PopupAjouterUser.jsx : Permet l'ajout d'utilisteur dans la popup page de gestion des utilisateurs
    
    Par Paul Jeanroy

    Fonctionnalité :
    - sp_valider_utilisateur : Permet d'ajouter un utilisateur dans une formation avec popup
    
*/

// Import React
import { useState } from "react";

// Import hooks personnalisé
import { useUserRole } from "../hooks/useUserRole";

// Import CSS
import "../styles/PopupAjouterUser.css";

export default function PopupAjouterUser({ setAddNewUser, annee, onAddUser }) {
    const [w_nom, setNom] = useState("");
    const [w_prenom, setPrenom] = useState("");
    const [w_role, setRole] = useState("apprenti");
    const [w_email, setEmail] = useState("");
    const [w_password, setPassword] = useState("");
    const { userId } = useUserRole();

    const sp_valider_utilisateur = async (e) => {
        e.preventDefault();
        const o_nouvel_apprenant = {
            w_nom,
            w_prenom,
            w_role,
            w_email,
            w_password,
            userId,
            annee,
        };

        try {
            const response = await fetch("http://localhost:5000/user/setUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(o_nouvel_apprenant),
            });

            if (!response.ok) {
                throw new Error("Erreur HTTP, statut : " + response.status);
            }

            setAddNewUser(false);
            onAddUser(o_nouvel_apprenant);
            fetchUsers();
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'utilisateur :", error.message);
        }
    };

    return (
        <div className="overlay">
            <div className="div-add-new-user">
                <div className="div-add-new-user-header">
                    <h1>Ajouter un utilisateur</h1>
                    <img src="/icon-croix.png" onClick={() => setAddNewUser(false)} alt="Fermer" />
                </div>
                <div className="div-add-new-user-body">
                    <form onSubmit={sp_valider_utilisateur} className="form-add-new-user">
                        <div className="div-input-add-new-user">
                            <label htmlFor="nom">Nom</label>
                            <input
                                type="text"
                                id="nom"
                                value={w_nom}
                                onChange={(e) => setNom(e.target.value)}
                                required
                            />
                        </div>
                        <div className="div-input-add-new-user">
                            <label htmlFor="prenom">Prénom</label>
                            <input
                                type="text"
                                id="prenom"
                                value={w_prenom}
                                onChange={(e) => setPrenom(e.target.value)}
                                required
                            />
                        </div>
                        <div className="div-input-add-new-user">
                            <label htmlFor="role">Rôle</label>
                            <input
                                type="text"
                                id="role"
                                value={w_role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                disabled
                            />
                        </div>
                        <div className="div-input-add-new-user">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={w_email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="div-input-add-new-user">
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                value={w_password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="div-btn-add-new-user">
                            <button type="submit">
                                Ajouter
                                <img src="/add-user.svg" alt="Ajouter utilisateur" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
