import { useState } from "react";
import { useUserRole } from "../hooks/useUserRole";
import "../styles/PopupAjouterUser.css";
import useUsersByFormation from "../hooks/useUsersByFormation";

export default function PopupAjouterUser({ setAddNewUser, annee, onAddUser }) {
    const [nom, setNom] = useState("");
    const [prenom, setPrenom] = useState("");
    const [role, setRole] = useState("apprenti");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const { userId } = useUserRole();
    const { users, loading, error, setUsers } = useUsersByFormation(userId);

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newUser = {
            nom,
            prenom,
            email,
            password,
            role,
            userId,
            annee,
        };

        try {
            console.log("Nouvel utilisateur à envoyer :", newUser);

            const response = await fetch("http://localhost:5000/user/setUser", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newUser),
            });

            console.log("Réponse du serveur :", response);

            if (!response.ok) {
                throw new Error("Erreur HTTP, statut : " + response.status);
            }

            const data = await response.json();

            setAddNewUser(false);
            onAddUser(newUser); // Ajoutez l'utilisateur à la liste existante
        } catch (error) {
            console.error("Erreur lors de l'ajout de l'utilisateur :", error.message);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div className="overlay">
            <div className="div-add-new-user">
                <div className="div-add-new-user-header">
                    <h1>Ajouter un utilisateur</h1>
                    <img src="/icon-croix.png" onClick={() => setAddNewUser(false)} alt="Fermer" />
                </div>
                <div className="div-add-new-user-body">
                    <form onSubmit={handleSubmit} className="form-add-new-user">
                        <div className="div-input-add-new-user">
                            <label htmlFor="nom">Nom</label>
                            <input
                                type="text"
                                id="nom"
                                value={nom}
                                onChange={(e) => setNom(e.target.value)}
                                required
                            />
                        </div>
                        <div className="div-input-add-new-user">
                            <label htmlFor="prenom">Prénom</label>
                            <input
                                type="text"
                                id="prenom"
                                value={prenom}
                                onChange={(e) => setPrenom(e.target.value)}
                                required
                            />
                        </div>
                        <div className="div-input-add-new-user">
                            <label htmlFor="role">Rôle</label>
                            <input
                                type="text"
                                id="role"
                                value={role}
                                onChange={(e) => setRole(e.target.value)}
                                required
                                disabled
                            />
                        </div>
                        <div className="div-input-add-new-user">
                            <label htmlFor="email">Email</label>
                            <input
                                type="email"
                                id="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="div-input-add-new-user">
                            <label htmlFor="password">Mot de passe</label>
                            <input
                                type="password"
                                id="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="div-btn-add-new-user">
                            <button type="submit">
                                Ajouter
                                <img src="/add-user.svg" alt="Ajouter utilisateur" />
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
