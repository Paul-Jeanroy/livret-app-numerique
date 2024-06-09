import { useNavigate } from "react-router-dom";
/* 
    fichier connexion.jsx
    Créer le 08/06 par PJ

    Fonctionnalités :
        - valider_formulaire : fonction qui permet de valider le formulaire de connexion.

*/
("use client");
import { useState } from "react";
import "../styles/connexion.css";

export default function Connexion() {
    const navigate = useNavigate();

    const [f_getPassword, setGetPassword] = useState(false);

    const valider_formulaire = (e) => {
        e.preventDefault();
        navigate("/accueil");
    };

    return (
        <>
            <main className="main-connexion">
                <h1>Livret d'apprentissage Numérique</h1>
                <section className="container-connexion">
                    {!f_getPassword && (
                        <>
                            <h2>Connexion</h2>
                            <form onSubmit={valider_formulaire}>
                                <input type="text" name="email" placeholder="email@domain.com" />
                                <input type="password" name="password" placeholder="Mot de passe" />
                                <span onClick={() => setGetPassword(true)}>Mot de passe oublié ?</span>
                                <button type="submit">Se connecter</button>
                            </form>
                            <div className="container-google">
                                <span className="span-gg">ou continuer avec </span>
                                <button>Google</button>
                            </div>
                        </>
                    )}

                    {f_getPassword && (
                        <>
                            <h2>Réinitialisation du mot de passe</h2>
                            <form>
                                <input type="text" name="email" placeholder="email@domain.com" />
                                <div className="reset-passw-btn">
                                    <button onClick={() => setGetPassword(false)}>Annuler</button>
                                    <button type="submit">Rénitialiser votre mot de passe</button>
                                </div>
                            </form>
                        </>
                    )}

                </section>
                <footer>
                    <img className="img-rs" src="region-sud.png" alt="Region Sud" />
                    <img className="img-ep" src="ecole-pratique.png" alt="Ecole Pratique" />
                    <img className="img-esiee" src="logo-esiee.png" alt="ESIEE" />
                    <img className="img-aixmars" src="cci-aix-mars.png" alt="CCI Aix-Marseille" />
                </footer>
            </main>
        </>
    );
}
