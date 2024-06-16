import "../styles/PopupAjouterUser.css";

export default function PopupAjouterUser({ setAddNewUser }) {
    return (
        <div className="overlay">
            <div className="div-add-new-user">
                <div className="div-add-new-user-header">
                    <h1>Ajouter un utilisateur</h1>
                    <img src="/icon-croix.png" onClick={() => setAddNewUser(false)} />
                </div>
                <div className="div-add-new-user-body">
                    <div className="div-input-add-new-user">
                        <label htmlFor="nom">Nom</label>
                        <input type="text" id="nom" />
                    </div>
                    <div className="div-input-add-new-user">
                        <label htmlFor="prenom">Prénom</label>
                        <input type="text" id="prenom" />
                    </div>
                    <div className="div-input-add-new-user">
                        <label htmlFor="role">Rôle</label>
                        <input type="text" id="role" />
                    </div>
                    <div className="div-input-add-new-user">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" />
                    </div>
                    <div className="div-input-add-new-user">
                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" id="password" />
                    </div>
                    <div className="div-btn-add-new-user">
                        <button type="submit">
                            Ajouter
                            <img src="/add-user.svg" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
