import Footer from "../components/Footer";
import Header from "../components/Header";
import ContainerGestionLivret from "../components/ContainerGestionLivret";

export default function GestionLivret() {

    return (
        <>
            <Header />
            <section className="section-gestion-livret">
                <h1 className="titre_page">Suivi des livrets</h1>
                <main className="main-gestion-livret" style={{ display: "flex" }}>
                    <ContainerGestionLivret annee={"L3"} data={data} />
                    <ContainerGestionLivret annee={"M1"} data={data} />
                    <ContainerGestionLivret annee={"M2"} data={data} />
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