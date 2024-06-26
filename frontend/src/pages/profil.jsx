// import { useEffect, useState } from "react";
// import Footer from "../components/Footer";
// import Header from "../components/Header";

// import "../styles/profil.css";

// export default function Profil() {
//     const [user, setUser] = useState(null);

//     useEffect(() => {
//         const fetchUser = async () => {
//             try {
//                 const token = localStorage.getItem('token');
//                 if (!token) {
//                     throw new Error('No token found');
//                 }

//                 const response = await fetch('http://localhost:5000/user/getUser', {
//                     headers: {
//                         'Authorization': `Bearer ${token}`
//                     }
//                 });

//                 if (!response.ok) {
//                     throw new Error('Erreur HTTP, statut : ' + response.status);
//                 }

//                 const userData = await response.json();
//                 console.log("Données utilisateur :", userData);
//                 setUser(userData);
//             } catch (error) {
//                 console.error('Erreur lors de la récupération des données utilisateur :', error.message);
//             }
//         };

//         fetchUser();
//     }, []);

//     return (
//         <div className="page-container">
//             <Header />
//             <div className="content-wrap">
//                 <h1 className="title">Profil</h1>
//                 <div className="avatar-container">
//                     <img src="/user.svg" alt="Avatar" className="avatar" />
//                     <input type="file" id="avatar-input" className="change-avatar-button" />
//                 </div>
//                 <div className="info-container">
//                     {user ? (
//                         <>
//                             <div className="info-item">
//                                 <span>Nom:</span>
//                                 <span>{user.nom}</span>
//                                 <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" />
//                             </div>
//                             <div className="info-item">
//                                 <span>Prénom:</span>
//                                 <span>{user.prenom}</span>
//                                 <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" />
//                             </div>
//                             <div className="info-item">
//                                 <span>Role:</span>
//                                 <span>{user.role}</span>
//                                 <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" />
//                             </div>
//                             <div className="info-item">
//                                 <span>Email:</span>
//                                 <span>{user.email}</span>
//                                 <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" />
//                             </div>
//                             <div className="info-item">
//                                 <span>Mot de passe:</span>
//                                 <span>•••••••••••</span>
//                                 <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" />
//                             </div>
//                         </>
//                     ) : (
//                         <p>Chargement en cours...</p>
//                     )}
//                 </div>
//             </div>
//             <Footer />
//         </div>

//     );
// }

//////////////////////////////////////////////////////////
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
                        <form onSubmit={handleSubmit}>
                            <div className="info-item">
                                <label>Nom:</label>
                                {isEditing.nom ? (
                                    <input type="text" name="nom" value={formData.nom} onChange={handleChange} />
                                ) : (
                                    <>
                                        <span>{user.nom}</span>
                                        <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" onClick={() => handleEditClick('nom')} />
                                    </>
                                )}
                            </div>
                            <div className="info-item">
                                <label>Prénom:</label>
                                {isEditing.prenom ? (
                                    <input type="text" name="prenom" value={formData.prenom} onChange={handleChange} />
                                ) : (
                                    <>
                                        <span>{user.prenom}</span>
                                        <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" onClick={() => handleEditClick('prenom')} />
                                    </>
                                )}
                            </div>
                            <div className="info-item">
                                <label>Rôle:</label>
                                {isEditing.role ? (
                                    <input type="text" name="role" value={formData.role} onChange={handleChange} />
                                ) : (
                                    <>
                                        <span>{user.role}</span>
                                        <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" onClick={() => handleEditClick('role')} />
                                    </>
                                )}
                            </div>
                            <div className="info-item">
                                <label>Email:</label>
                                {isEditing.email ? (
                                    <input type="email" name="email" value={formData.email} onChange={handleChange} />
                                ) : (
                                    <>
                                        <span>{user.email}</span>
                                        <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" onClick={() => handleEditClick('email')} />
                                    </>
                                )}
                            </div>
                            <div className="info-item">
                                <label>Mot de passe:</label>
                                {isEditing.password ? (
                                    <input type="password" name="password" value={formData.password} onChange={handleChange} />
                                ) : (
                                    <>
                                        <span>•••••••••••</span>
                                        <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" onClick={() => handleEditClick('password')} />
                                    </>
                                )}
                            </div>
                            <button type="submit">Enregistrer les modifications</button>
                        </form>
                    ) : (
                        <p>Chargement en cours...</p>
                    )}
                </div>
            </div>
            <Footer />
        </div>
    );
}

