import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

import "../styles/profil.css";

export default function Profil() {
    const [user, setUser] = useState(null);
    const [isEditing, setIsEditing] = useState({
        nom: false,
        prenom: false,
        role: false,
        email: false,
        password: false,
    });

    const [formData, setFormData] = useState({
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
                    throw new Error('No token found');
                }

                const response = await fetch('http://localhost:5000/user/getUser', {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                });

                if (!response.ok) {
                    throw new Error('Erreur HTTP, statut : ' + response.status);
                }

                const userData = await response.json();
                setUser(userData);
                setFormData({
                    nom: userData.nom,
                    prenom: userData.prenom,
                    role: userData.role,
                    email: userData.email,
                    password: '', // Laisser vide au départ
                });
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur :', error.message);
            }
        };

        fetchUser();
    }, []);

    const handleEditClick = (field) => {
        setIsEditing({ ...isEditing, [field]: true });
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const updatedUser = { ...formData };

        if (!formData.password) {
            delete updatedUser.password;
        }

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No token found');
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

            const result = await response.json();
            setUser({ ...user, ...updatedUser });
            setIsEditing({
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
                        <h1 className="title">Profil</h1>
                        <div className="info-container">
                            {user ? (
                                <form className="form-modif-profil" onSubmit={handleSubmit}>
                                    <div className="info-item">
                                        <label>Nom :</label>
                                        {isEditing.nom ? (
                                            <div className="div-modif-info">
                                                <input type="text" name="nom" value={formData.nom} onChange={handleChange} />
                                                <button type="submit">Enregistrer les modifications</button>
                                            </div>
                                        ) : (
                                            <>
                                                <span>{user.nom}</span>
                                                <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" onClick={() => handleEditClick('nom')} />
                                            </>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <label>Prénom :</label>
                                        {isEditing.prenom ? (
                                            <div className="div-modif-info">
                                                <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} />
                                                <button type="submit">Enregistrer les modifications</button>
                                            </div>
                                        ) : (
                                            <>
                                                <span>{user.prenom}</span>
                                                <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" onClick={() => handleEditClick('prenom')} />
                                            </>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <label>Rôle :</label>
                                        {isEditing.role ? (
                                            <div className="div-modif-info">
                                                <input type="text" name="role" value={formData.role} onChange={handleChange} />
                                                <button type="submit">Enregistrer les modifications</button>
                                            </div>
                                        ) : (
                                            <>
                                                <span>{user.role}</span>
                                                <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" onClick={() => handleEditClick('role')} />
                                            </>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <label>Email :</label>
                                        {isEditing.email ? (
                                            <div className="div-modif-info">
                                                <input type="email" name="email" value={formData.email} onChange={handleChange} />
                                                <button type="submit">Enregistrer les modifications</button>
                                            </div>
                                        ) : (
                                            <>
                                                <span>{user.email}</span>
                                                <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" onClick={() => handleEditClick('email')} />
                                            </>
                                        )}
                                    </div>
                                    <div className="info-item">
                                        <label>Mot de passe :</label>
                                        {isEditing.password ? (
                                            <div className="div-modif-info">
                                                <input type="password" name="password" value={formData.password} onChange={handleChange} />
                                                <button type="submit">Enregistrer les modifications</button>
                                            </div>
                                        ) : (
                                            <>
                                                <span>•••••••••••</span>
                                                <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" onClick={() => handleEditClick('password')} />
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
