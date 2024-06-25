import "../styles/PopupConfirmDeleteUser.css";

export default function PopupConfirmDeleteUser({ setDeleteUser, w_tt_data_delet_user, onDelete }) {

    const sp_supprimer_user = async () => {
        try {
            const response = await fetch(`http://localhost:5000/user/deleteUser?user_id=${w_tt_data_delet_user.id_user}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Erreur HTTP, statut : ' + response.status + ', message : ' + errorText);
            }

            const data = await response.json();
            onDelete(w_tt_data_delet_user.id_user);

        } catch (error) {
            console.error('Erreur lors de la suppression de l’utilisateur:', error.message);
        }
    };

    return (
        <div className="overlay">
            <div className="div-delete-new-user">
                <div className="div-delete-new-user-header">
                    <h1>Confirmation</h1>
                    <img src="/icon-croix.png" onClick={() => setDeleteUser(false)} />
                </div>
                <div className="div-container-confirm">Etes vous sûr de vouloir supprimer l’utilisateur</div>
                <div className="div-container-confirm">{w_tt_data_delet_user.nom + " " + w_tt_data_delet_user.prenom}</div>
                <div className="div-container-btn-suppr-user">
                    <button className="btn-annuler" onClick={() => setDeleteUser(false)}>
                        annuler
                        <img src="/cancel.svg" />
                    </button>
                    <button type="submit" className="btn-valider" onClick={sp_supprimer_user}>
                        valider
                        <img src="/valider.svg" />
                    </button>
                </div>
            </div>
        </div>
    );
}
