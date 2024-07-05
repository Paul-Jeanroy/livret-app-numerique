/* Composant PopupModifierFormation.jsx : Popup qui permet la modification des blocs et compétences d'une formation (page gestion formation)

    Par Jeanroy Paul

    Fonctionnalités :
    - sp_modifier_info : Permet de modifier les informations d'un bloc ou d'une compétence.
    - sp_valider_modification : Permet de valider la modification apportée dans la popup de modification.	

*/

// Import REACT
import { useState, useEffect } from "react";

// Import CSS
import "../styles/popupModifierFormation.css";

const PopupModifierFormation = ({ f_open_popup, onClose, o_initiale_donnee, onSave }) => {
    const [o_donnee_formulaire, setFormData] = useState(o_initiale_donnee);

    useEffect(() => {
        setFormData(o_initiale_donnee);
    }, [o_initiale_donnee]);

    const sp_modifier_info = (e) => {
        const { w_name_form, w_valeur_form } = e.target;
        setFormData({ ...o_donnee_formulaire, [w_name_form]: w_valeur_form });
    };

    const sp_valider_modification = () => {
        onSave(o_donnee_formulaire);
        onClose();
    };

    if (!f_open_popup) return null;

    return (
        <div className="div_overlay_popup">
            <div className="div_container_popup">
                <h2>Modifier</h2>
                <label>
                    Nom:
                    <input type="text" name="nom" value={o_donnee_formulaire.nom} onChange={sp_modifier_info} />
                </label>
                <label>
                    Description:
                    <textarea name="description" value={o_donnee_formulaire.description} onChange={sp_modifier_info} />
                </label>
                <div className="div_action_popup">
                    <button onClick={sp_valider_modification}>Valider</button>
                    <button onClick={onClose}>Annuler</button>
                </div>
            </div>
        </div>
    );
};

export default PopupModifierFormation;
