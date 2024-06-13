import "../styles/ContainerGestionLivret.css";

export default function ContainerGestionLivret(props) {
    return (
        <main className="main-container-suivi-livret">
            <div className="div-header-suivi-livret">
                <h1>{props.annee}</h1>
                <img src="/icon-chevron.png" />
            </div>
            <div className="container-suivi-livret">
                {props.data.map((item, index) => (
                    <div key={index} className="div-ligne-suivi-livret">
                        <div className="div-nom-livret">
                            <p>{item.nom}</p>
                            <p>{item.prenom}</p>
                        </div>
                        <img src="/icon-chevron.png" />
                    </div>
                ))}
            </div>
        </main>
    );
}
