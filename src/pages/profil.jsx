/* 
    fichier profil.jsx
    Créer le 08/06 par PJ

    Fonctionnalités :
    - ...
*/

import Footer from "../components/Footer";
import Header from "../components/Header";


import "../styles/profil.css";

export default function Profil(){

    return(
        
        <div className="page-container">
            <Header />
            <div className="content-wrap">
                <h1 className="title">Profil</h1>
                <div className="avatar-container">
                    <img src="/user.svg" alt="Avatar" className="avatar" />
                    <input type="file" id="avatar-input"  className="change-avatar-button" />
                </div>
                <div className="info-container">
                    <div className="info-item">
                        <span>Nom:</span>
                        <span>Doe</span>
                        <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" />
                    </div>
                    <div className="info-item">
                        <span>Prénom:</span>
                        <span>John</span>
                        <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" />
                    </div>
                    <div className="info-item">
                        <span>Role:</span>
                        <span>Étudiant</span>
                        <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" />
                    </div>
                    <div className="info-item">
                        <span>Email:</span>
                        <span>john.doe@example.com</span>
                        <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" />
                    </div>
                    <div className="info-item">
                        <span>Mot de passe:</span>
                        <span>********</span>
                        <img src="/pencil-edit.svg" alt="Edit" className="edit-icon" />
                    </div>
                </div>
            </div>
            <Footer />
        </div>

    )
} 