import { useEffect, useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ContainerGestionUtilisateur from "../components/ContainerGestionUtilisateur";
import { useUserRole } from "../hooks/useUserRole";


export default function GestionUtilisateur() {
    const [w_tt_data_user, setDataUserByFormation] = useState([]);
    const {userId } = useUserRole();
    console.log("id_user dans gestion utilisateur", userId);

    useEffect(() => {
        const getUserByFormation = async (userId) => {
            console.log("userId", userId);
            try {
                const response = await fetch(`http://localhost:5000/user/getIdFormationByUser?userId=${userId}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error('Erreur HTTP, statut : ' + response.status + ', message : ' + errorText);
                }

                const data = await response.json();
                setDataUserByFormation(data);

            } catch (error) {
                console.error('Erreur lors de la récupération des utilisateurs:', error.message);
            }
        };

        if (userId) {
            getUserByFormation(userId);
        }
    }, []);

    // Regroupement des utilisateurs par année
    const usersByYear = w_tt_data_user.reduce((acc, user) => {
        if (!acc[user.annee]) {
            acc[user.annee] = [];
        }
        acc[user.annee].push(user);
        return acc;
    }, {});

    return (
        <>
            <Header />
            <section className="section-gestion-utilisateur">
                <h1 className="titre_page"><span>Gestion des utilisateurs</span></h1>
                <main className="main-gestion-utilisateur" style={{ display: "flex" }}>
                    {Object.keys(usersByYear).map((annee) => (
                        <ContainerGestionUtilisateur key={annee} annee={annee} users={usersByYear[annee]} />
                    ))}
                </main>
            </section>
            <Footer />
        </>
    );
}
