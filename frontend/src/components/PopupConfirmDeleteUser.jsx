import "../styles/PopupConfirmDeleteUser.css";

export default function PopupConfirmDeleteUser({ setDeleteUser }) {
    return (
        <div className="overlay">
            <div className="div-delete-new-user">
                <div className="div-delete-new-user-header">
                    <h1>Confirmation</h1>
                    <img src="/icon-croix.png" onClick={() => setDeleteUser(false)} />
                </div>
                <div className="div-container-confirm">Etes vous sûr de vouloir supprimer l’utilisateur</div>
                <div className="div-container-confirm">[nom de l'utilisateur]</div>
                <div className="div-container-btn-suppr-user">
                    <button className="btn-annuler" onClick={() => setDeleteUser(false)}>
                        annuler
                        <img src="/cancel.svg" />
                    </button>
                    <button type="submit" className="btn-valider">
                        valider
                        <img src="/valider.svg" />
                    </button>
                </div>
            </div>
        </div>
    );
}
