import Footer from "../components/Footer";
import Header from "../components/Header";
import ContainerGestionUtilisateur from "../components/ContainerGestionUtilisateur";

export default function GestionUtilisateur() {
    return (
        <>
            <Header />
            <section className="section-gestion-utilisateur">
                <h1 className="titre_page"><span>Gestion des utilisateurs</span></h1>
                <main className="main-gestion-utilisateur" style={{ display: "flex" }}>
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
