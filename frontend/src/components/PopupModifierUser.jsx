/* 
    composant PopupModifierUser.jsx
   
    Par Paul Jeanroy et Hossame Laib 

    Fonctionnalité :
    - sp_modifier_user : fonction qui permet de modifier un utilisateur dans la page gestion utilisateur
    
*/


// Import REACT
import { useState } from "react";

// Import CSS
import "../styles/PopupModifierUser.css";

// Import externes
import axios from 'axios';
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function PopupModifierUser({ setModifUser, user, onUpdateUser, fetchUsers }) {
    const [w_nom, setNom] = useState(user.nom);
    const [w_prenom, setPrenom] = useState(user.prenom);
    const [w_role, setRole] = useState(user.role);
    const [w_email, setEmail] = useState(user.email);
    const [w_password, setPassword] = useState(user.password);

    const sp_modifier_user = async (e) => {
        e.preventDefault();
        const o_nouvel_apprenant = {
            nom: w_nom,
            prenom: w_prenom,
            role: w_role,
            email: w_email,
            password: w_password,
        }

        try {
            const response = await axios.put(`http://localhost:5000/user/setUpdateUser?user_id=${user.id_user}`, o_nouvel_apprenant, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (response.status === 200) {
                toast.success("Utilisateur modifié avec succès.");
                fetchUsers();
                onUpdateUser(o_nouvel_apprenant);
                setModifUser(false);
            } else {
                toast.error("Erreur lors de la modification de l'utilisateur.");
            }
        } catch (error) {
            toast.error("Oups, il y a une erreur lors de la modification d'un utilisateur.");
        }
        
    };

    return (
        <div className="div_overlay">
            <ToastContainer position="top-right" autoClose={10000} />
            <div className="div_container_ajout_user">
                <div className="div_header_ajout_user">
                    <h1>Modifier un utilisateur</h1>
                    <img src="/icon-croix.png" onClick={() => setModifUser(false)} alt="Fermer" />
                </div>
                <div className="div_body_ajout_user">

                    <div className="div_input_ajout_user">
                        <label htmlFor="nom">Nom</label>
                        <input type="text" id="nom" value={w_nom} onChange={(e) => setNom(e.target.value)} required
                        />
                    </div>
                    <div className="div_input_ajout_user">
                        <label htmlFor="prenom">Prénom</label>
                        <input type="text" id="prenom" value={w_prenom} onChange={(e) => setPrenom(e.target.value)} />
                    </div>
                    <div className="div_input_ajout_user">
                        <label htmlFor="role">Rôle</label>
                        <input type="text" id="role" value={w_role} onChange={(e) => setRole(e.target.value)} />
                    </div>
                    <div className="div_input_ajout_user">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={w_email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <div className="div_input_ajout_user">
                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" id="password" value={w_password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="div_footer_ajout_user">
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

