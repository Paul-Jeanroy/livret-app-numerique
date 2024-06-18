import "../styles/PopupModifierUser.css";

export default function PopupModifierUser({ setModifUser }) {
    return (
        <div className="overlay">
            <div className="div-add-modif-user">
                <div className="div-add-modif-user-header">
                    <h1>Modifier un utilisateur</h1>
                    <img src="/icon-croix.png" onClick={() => setModifUser(false)} />
                </div>
                <div className="div-add-modif-user-body">
                    <div className="div-input-add-modif-user">
                        <label htmlFor="nom">Nom</label>
                        <input type="text" id="nom" />
                    </div>
                    <div className="div-input-add-modif-user">
                        <label htmlFor="prenom">Prénom</label>
                        <input type="text" id="prenom" />
                    </div>
                    <div className="div-input-add-modif-user">
                        <label htmlFor="role">Rôle</label>
                        <input type="text" id="role" />
                    </div>
                    <div className="div-input-add-modif-user">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" />
                    </div>
                    <div className="div-input-add-modif-user">
                        <label htmlFor="password">Mot de passe</label>
                        <input type="password" id="password" />
                    </div>
                    <div className="div-btn-add-modif-user">
                        <button type="submit">
                            Valider les modifications
                            <img src="/add-user.svg" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
