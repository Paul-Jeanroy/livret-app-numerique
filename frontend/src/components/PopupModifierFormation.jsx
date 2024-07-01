import { useState, useEffect } from "react";
import "../styles/popupModifierFormation.css";

const PopupModifierFormation = ({ isOpen, onClose, initialData, onSave }) => {
    const [formData, setFormData] = useState(initialData);

    useEffect(() => {
        setFormData(initialData);
    }, [initialData]);

    const sp_modifier_info = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const sp_valider_modification = () => {
        onSave(formData);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h2>Modifier</h2>
                <label>
                    Nom:
                    <input type="text" name="nom" value={formData.nom} onChange={sp_modifier_info} />
                </label>
                <label>
                    Description:
                    <textarea name="description" value={formData.description} onChange={sp_modifier_info} />
                </label>
                <div className="popup-actions">
                    <button onClick={sp_valider_modification}>Valider</button>
                    <button onClick={onClose}>Annuler</button>
                </div>
            </div>
        </div>
    );
};

export default PopupModifierFormation;
