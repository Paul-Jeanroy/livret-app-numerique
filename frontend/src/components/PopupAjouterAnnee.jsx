/* composant PopupAjouterAnnee.jsx : Permet l'ajout d'une classe via la page de gestion des utilisateurs

    Par Paul Jeanroy

    Fonctionnalité :
    - sp_valider_annee : Permet d'ajouter une année pour une formation dans la popup

*/

// Import CSS
import "../styles/PopupAjouterUser.css";

// Import hooks personalisé
import { useUserRole } from '../hooks/useUserRole';

// Import REACT
import { useState } from 'react'

// Import snackbar
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';

export default function PopupAjouterUser({ setAddAnneePopup, fetchUsers }) {
    const [w_nom, setNom] = useState("");
    const {userId} = useUserRole();

    const sp_valider_annee = async (e) => {
        e.preventDefault();
        try {
            const reponse = await fetch(`http://localhost:5000/formation/setAnneOnFormation?user_id=${userId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ w_nom })
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
                                value={w_nom}
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
