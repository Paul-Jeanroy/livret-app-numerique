/* 
    composant PopupModifierUser.jsx
    Créer le 08/06 par PJ-HL

    Fonctionnalité :
    - sp_modifier_user : fonction qui permet de modifier un utilisateur dans la page gestion utilisateur
    - ...
    
*/

import { useState } from "react";
import "../styles/PopupModifierUser.css";

export default function PopupModifierUser({ setModifUser, user, onUpdateUser, fetchUsers }) {
    const [nom, setNom] = useState(user.nom);
    const [prenom, setPrenom] = useState(user.prenom);
    const [role, setRole] = useState(user.role);
    const [email, setEmail] = useState(user.email);
    const [password, setPassword] = useState(user.password);

    const sp_modifier_user = async (e) => {
        e.preventDefault();
        const updateUser = {
            nom,
            prenom,
            role,
            email,
            password,
        }

        try {
            const response = await fetch(`http://localhost:5000/user/updateUser?user_id=${user.id_user}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',

                },
                body: JSON.stringify(updateUser)
            });

            const result = await response.json();
            if (response.ok) {
                fetchUsers();
                onUpdateUser(updateUser);
                setModifUser(false);

            } else {
                console.error(result.error)
            }
        } catch (error) {
            console.error('Une erreur est survenue:', error);
        }
    };

    return (
        <div className="overlay">
            <div className="div-add-modif-user">
                <div className="div-add-modif-user-header">
                    <h1>Modifier un utilisateur</h1>
                    <img src="/icon-croix.png" onClick={() => setModifUser(false)} alt="Fermer" />
                </div>
                <div className="div-add-modif-user-body">

                    <div className="div-input-add-modif-user">
                        <label htmlFor="nom">Nom</label>
                        <input type="text" id="nom" value={nom} onChange={(e) => setNom(e.target.value)} required
                        />
                    </div>
                    <div className="div-input-add-modif-user">
                        <label htmlFor="prenom">Prénom</label>
                        <input type="text" id="prenom" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
                    </div>
                    <div className="div-input-add-modif-user">
                        <label htmlFor="role">Rôle</label>
                        <input type="text" id="role" value={role} onChange={(e) => setRole(e.target.value)} />
                    </div>
                    <div className="div-input-add-modif-user">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="div-input-add-modif-user">
                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="div-btn-add-modif-user">
                        <button type="submit" onClick={sp_modifier_user}>
                            Valider les modifications
                            <img src="/add-user.svg" />
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

