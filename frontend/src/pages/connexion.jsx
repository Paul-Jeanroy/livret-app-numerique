import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/connexion.css";
import { useUserRole } from "../hooks/useUserRole.jsx";
import ValidationUser from "../components/ValidationUser.jsx";

export default function Connexion() {
    const navigate = useNavigate();
    const [f_getPassword, setGetPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [estValide, setValideUser] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');
    const { setRoleUser, setUserId } = useUserRole();
    const [f_isValidUser, setValidationUser] = useState(false);

    const valider_formulaire = async (e) => {
        e.preventDefault();

        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Erreur HTTP, statut : ' + response.status);
            }

            const data = await response.json();
            setRoleUser(data.role);
            setUserId(data.id_user);
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('roleUser', data.role);
            setValideUser(data.est_valide);

        } catch (error) {
            console.error('Erreur lors de la connexion :', error.message);
            setErrorMessage('Email ou mot de passe incorrect');
        }
    };

    useEffect(() => {
        if (estValide === 0) {
            setValidationUser(true);
        } else if (estValide === 1) {
            navigate("/accueil");
        }
    }, [estValide, navigate]);

    return (
        <>
            {f_isValidUser ? (
                <ValidationUser setValidationUser={setValidationUser} />
            ) : (
                <main className="main-connexion">
                    <h1>Livret d'apprentissage Numérique</h1>
                    <section className="container-connexion">
                        {!f_getPassword && (
                            <>
                                <h2>Connexion</h2>
                                <form onSubmit={valider_formulaire}>
                                    <input
                                        type="text"
                                        name="email"
                                        placeholder="email@domain.com"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <input
                                        type="password"
                                        name="password"
                                        placeholder="Mot de passe"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                    />
                                    {errorMessage && <p className="error-message">{errorMessage}</p>}
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
                                        <button type="submit">Réinitialiser votre mot de passe</button>
                                    </div>
                                </form>
                            </>
                        )}
                        
                    </section>
                    <footer className="footer-connexion">
                        <img className="img-rs" src="region-sud.png" alt="Region Sud" />
                        <img className="img-ep" src="ecole-pratique.png" alt="Ecole Pratique" />
                        <img className="img-esiee" src="logo-esiee.png" alt="ESIEE" />
                        <img className="img-aixmars" src="cci-aix-mars.png" alt="CCI Aix-Marseille" />
                    </footer>
                </main>
            )}
        </>
    );
}
