import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";

import "../styles/profil.css";

export default function Profil() {
    const [user, setUser] = useState(null);

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
                console.log("Données utilisateur :", userData);
                setUser(userData);
            } catch (error) {
                console.error('Erreur lors de la récupération des données utilisateur :', error.message);
            }
        };

        fetchUser();
    }, []);

    return (
        <div className="page-container">
            <Header />
            <div className="content-wrap">
                <h1 className="title">Profil</h1>
                <div className="avatar-container">
                    <img src="/user.svg" alt="Avatar" className="avatar" />
                    <input type="file" id="avatar-input" className="change-avatar-button" />
                </div>
                <div className="info-container">
                    {user ? (
                        <>
                            <div className="info-item">
                                <span>Nom:</span>
                                <span>{user.nom}</span>
                                <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" />
                            </div>
                            <div className="info-item">
                                <span>Prénom:</span>
                                <span>{user.prenom}</span>
                                <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" />
                            </div>
                            <div className="info-item">
                                <span>Role:</span>
                                <span>{user.role}</span>
                                <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" />
                            </div>
                            <div className="info-item">
                                <span>Email:</span>
                                <span>{user.email}</span>
                                <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" />
                            </div>
                            <div className="info-item">
                                <span>Mot de passe:</span>
                                <span>•••••••••••</span>
                                <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" />
                            </div>
                        </>
                    ) : (
                        <p>Chargement en cours...</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>

    );
}
