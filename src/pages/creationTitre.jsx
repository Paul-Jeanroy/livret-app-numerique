import Header from "../components/Header";
import Footer from "../components/Footer";

import "../styles/creationTitre.css";

export default function CreationTitre() {
    return (
        <>
            <Header />
            <main>
                <section id="section-create-titre">
                    <h1 className="titre_page">Création du titre</h1>
                    <div className="container-search-titre">
                        <input type="text" placeholder="Veuillez entrer le titre RNCP" />
                        <img src="/search.svg" />
                    </div>
                </section>
            </main>
            <Footer />
        </>
    );
}
