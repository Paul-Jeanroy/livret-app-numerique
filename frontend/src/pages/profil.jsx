import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

import "../styles/profil.css";

export default function Profil() {
    const [o_user, setUser] = useState(null);
    const [f_modifUser, setModifUser] = useState({
        nom: false,
        prenom: false,
        role: false,
        email: false,
        password: false,
    });

    const [o_newValeurUser, setNewValeurUser] = useState({
        nom: '',
        prenom: '',
        role: '',
        email: '',
        password: '',
    });

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Pas de token trouvé !');
                }

                const response = await fetch('http://localhost:5000/user/getUser', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur HTTP, statut : ' + response.status);
                }

                const reponse = await response.json();
                setUser(reponse);

                setNewValeurUser({
                    nom: reponse.nom,
                    prenom: reponse.prenom,
                    role: reponse.role,
                    email: reponse.email,
                    password: '',
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur :', error.message);
            }
        };

        fetchUser();
    }, []);

    const sp_modifier_valeur = (field) => {
        setModifUser({ ...f_modifUser, [field]: true });
    };

    const sp_modifier_user = (e) => {
        const { name, value } = e.target;
        console.log(name, value);
        setNewValeurUser({
            ...o_newValeurUser,
            [name]: value
        });
    };

    const sp_valider_modification = async (e) => {
        e.preventDefault();
        const updatedUser = { ...o_newValeurUser };

        if (!o_newValeurUser.password) {
            delete updatedUser.password;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('pas de token trouvé');
            }

            const response = await fetch('http://localhost:5000/user/updateProfile', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(updatedUser)
            });

            if (!response.ok) {
                const errorText = await response.text();
                throw new Error('Erreur HTTP, statut : ' + response.status + ', message : ' + errorText);
            }

            setUser({ ...o_user, ...updatedUser });
            setModifUser({
                nom: false,
                prenom: false,
                role: false,
                email: false,
                password: false,
            });
        } catch (error) {
            console.error('Erreur lors de la mise à jour du profil utilisateur :', error.message);
        }
    };

    return (
        <>
            <Header />
            <div className="content-wrap">
                <main className="main-container">
                    <div className="div-container">
                        <h1 className="titre_page">Profil</h1>
                        <div className="info-container">
                            {o_user ? (
                                <form className="form-modif-profil" onSubmit={sp_valider_modification}>
                                    <div className="info-item">
                                        <label>Nom :</label>
                                        {f_modifUser.nom ? (
                                            <div className="div-modif-info">
                                                <input type="text" name="nom" value={o_newValeurUser.nom} onChange={sp_modifier_user} />
                                                <button type="submit">Enregistrer les modifications</button>
                                            </div>
                                        ) : (
                                            <>
                                                <span>{o_user.nom}</span>
                                                <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" onClick={() => sp_modifier_valeur('nom')} />
                                            </>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <label>Prénom :</label>
                                        {f_modifUser.prenom ? (
                                            <div className="div-modif-info">
                                                <input type="text" name="prenom" value={o_newValeurUser.prenom} onChange={sp_modifier_user} />
                                                <button type="submit">Enregistrer les modifications</button>
                                            </div>
                                        ) : (
                                            <>
                                                <span>{o_user.prenom}</span>
                                                <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" onClick={() => sp_modifier_valeur('prenom')} />
                                            </>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <label>Rôle :</label>
                                        {f_modifUser.role ? (
                                            <div className="div-modif-info">
                                                <input type="text" name="role" value={o_newValeurUser.role} onChange={sp_modifier_user} />
                                                <button type="submit">Enregistrer les modifications</button>
                                            </div>
                                        ) : (
                                            <>
                                                <span>{o_user.role}</span>
                                                <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" onClick={() => sp_modifier_valeur('role')} />
                                            </>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <label>Email :</label>
                                        {f_modifUser.email ? (
                                            <div className="div-modif-info">
                                                <input type="email" name="email" value={o_newValeurUser.email} onChange={sp_modifier_user} />
                                                <button type="submit">Enregistrer les modifications</button>
                                            </div>
                                        ) : (
                                            <>
                                                <span>{o_user.email}</span>
                                                <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" onClick={() => sp_modifier_valeur('email')} />
                                            </>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <label>Mot de passe :</label>
                                        {f_modifUser.password ? (
                                            <div className="div-modif-info">
                                                <input type="password" name="password" value={o_newValeurUser.password} onChange={sp_modifier_user} />
                                                <button type="submit">Enregistrer les modifications</button>
                                            </div>
                                        ) : (
                                            <>
                                                <span>•••••••••••</span>
                                                <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" onClick={() => sp_modifier_valeur('password')} />
                                            </>
                                        )}
                                    </div>
                                </form>
                            ) : (
                                <p>Chargement en cours...</p>
                            )}
                        </div>
                    </div>
                </main>
                <Footer />
            </div>
        </>
    );
}
