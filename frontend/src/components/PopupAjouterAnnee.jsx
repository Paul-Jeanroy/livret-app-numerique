/* 
composant PopupAjouterAnnee.jsx
Créer le 29/06 par PJ

Fonctionnalité :
- sp_valider_annee : Permet d'ajouter une année pour une formation dans la popup
- ...

*/

import "../styles/PopupAjouterUser.css";
import { useUserRole } from '../hooks/useUserRole';
import { useState } from 'react'

export default function PopupAjouterUser({ setAddAnneePopup, fetchUsers }) {
    const [nom, setNom] = useState("");
    const {userId} = useUserRole();

    const sp_valider_annee = async (e) => {
        e.preventDefault();
        try {
            const reponse = await fetch(`http://localhost:5000/formation/setAnneOnFormation?user_id=${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ nom })
            })

            if(reponse.ok){
                fetchUsers();
                setAddAnneePopup(false)
            }
        } catch (error) {
            console.error("Erreur dans l'ajout d'une classe (année) dans une formation");
        }
    }


    return (
        <div className="overlay">
            <div className="div-add-new-user">
                <div className="div-add-new-user-header">
                    <h1>Ajouter une classe</h1>
                    <img src="/icon-croix.png" onClick={() => setAddAnneePopup(false)} alt="Fermer" />
                </div>
                <div className="div-add-new-user-body">
                    <form onSubmit={sp_valider_annee} className="form-add-new-user">
                        <div className="div-input-add-new-user">
                            <label htmlFor="nom">Nom de l'année</label>
                            <input
                                type="text"
                                id="nom"
                                placeholder="Exemple : L3"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                required
                            />
                        </div>
                        <div className="div-btn-add-new-user">
                            <button type="submit">
                                Ajouter
                                <img src="/add-user.svg" alt="Ajouter une année" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
