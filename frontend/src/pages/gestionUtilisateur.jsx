import { useEffect, useState } from "react";

import Footer from "../components/Footer";
import Header from "../components/Header";
import ContainerGestionUtilisateur from "../components/ContainerGestionUtilisateur";

export default function GestionUtilisateur() {
    // definir un state permettant de stocker les datas utilisateurs
    const [dataUser, setDataUser] = useState([]);

    

    // Récupération des utilsiateurs en fonction de la formation du cooredinateur de filiere connecté

    // La requête SQL se fait dans le user_routes.py ( créer une nouvelle route dedans )

    // #1 Récupération de l'id de la formation si role == coordinateur

    useEffect(() => {
        const fetchUsersByFormationId = async (formationId) => {
            formationId = 1;
            try {
                const response = await fetch(`http://localhost:5000/user/getUsersByFormationId/${formationId}`);
                if (!response.ok) {
                    throw new Error("Erreur HTTP, statut : " + response.status);
                }
                const userDataByFormation = await response.json();
                console.log(userDataByFormation);
                setDataUser(userDataByFormation); // Stocker les données des utilisateurs dans le state
            } catch (error) {
                console.error("Erreur lors de la récupération des utilisateurs :", error.message);
            }
        };

        fetchUsersByFormationId()
    }, []);

    // #2 Récupération des utilisateurs en fonction de l'id de formation récupéré auparavant
    // #3 Set dans le state permettant de stocker les datas utilisateurs



    return (
        <>
            <Header />
            <section className="section-gestion-utilisateur">
                <h1 className="titre_page"><span>Gestion des utilisateurs</span></h1>
                <main className="main-gestion-utilisateur" style={{ display: "flex" }}>
                    {/* #4 BOUCLE : Parcours du nombre d'année récupéré pour appeler x fois le composant ContainerGestionUtilisateur /}
                    {/ Envoyer en props les données pour chaque année de formation data={nom du state au dessus}*/}
                    <ContainerGestionUtilisateur annee={"L3"} data={data} />
                    <ContainerGestionUtilisateur annee={"M1"} data={data} />
                    <ContainerGestionUtilisateur annee={"M2"} data={data} />
                </main>
            </section>
            <Footer />
        </>
    );
}
const data = [
    {
        id: 1,
        nom: "Dupont",
        prenom: "Jean",
    },
    {
        id: 2,
        nom: "Durand",
        prenom: "Pierre",
    },
    {
        id: 3,
        nom: "Martin",
        prenom: "Sophie",
    },
];