/* 
    composant ValidationUser.jsx
    Créer le 26/06 par PJ-HL

    Fonctionnalité :
    - sp_valider_user : fonction qui permet de valider un user en base avec un nouveau mot de passe (lors de la premiere co)
    - ...
    
*/


import "../styles/validationUser.css"
import { useNavigate } from "react-router-dom";
import { useUserRole } from "../hooks/useUserRole";
import { useState } from "react";

export default function ValidationUser() {
    const { userId } = useUserRole();
    const [w_error_message, setErrorMessage] = useState("");
    const navigate = useNavigate(); 

    const sp_valider_user = async (e) => {
        e.preventDefault();

        if (e.target[0].value !== e.target[1].value) {
            setErrorMessage("Les deux mots de passe ne sont pas identiques");
            return;
        }

        try {
            const response = await fetch(`http://localhost:5000/auth/validationUser`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id: userId,
                    password: e.target[0].value,
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Erreur HTTP, statut : ' + response.status + ', message : ' + errorText);
            }

            navigate("/accueil");

        } catch (error) {
            setErrorMessage("Erreur lors de la validation de l'utilisateur");
        }
    }

    return (
        <div className="container-valid-user">
            <h1 className="titre_page">Validation</h1>
            <form onSubmit={sp_valider_user}>
                <span>Afin de valider votre compte, veuillez entrer un mot de passe</span>
                <input type="password" placeholder="Mot de passe" />
                <input type="password" placeholder="Confirmer votre mot de passe" />
                <button type="submit">Valider</button>
                {w_error_message && <span className="error-message">{w_error_message}</span>}
            </form>
        </div>
    );
}
