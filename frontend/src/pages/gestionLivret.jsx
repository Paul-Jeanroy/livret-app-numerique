// import Footer from "../components/Footer";
// import Header from "../components/Header";
// import ContainerGestionLivret from "../components/ContainerGestionLivret";

// export default function GestionLivret() {

//     return (
//         <>
//             <Header />
//             <section className="section-gestion-livret">
//                 <h1 className="titre_page">Suivi des livrets</h1>
//                 <main className="main-gestion-livret" style={{ display: "flex" }}>
//                     <ContainerGestionLivret annee={"L3"} data={data} />
//                     <ContainerGestionLivret annee={"M1"} data={data} />
//                     <ContainerGestionLivret annee={"M2"} data={data} />
//                 </main>
//             </section>

//             <Footer />
//         </>
//     );
// }

// const data = [
//     {
//         id: 1,
//         nom: "Dupont",
//         prenom: "Jean",
//     },
//     {
//         id: 2,
//         nom: "Durand",
//         prenom: "Pierre",
//     },
//     {
//         id: 3,
//         nom: "Martin",
//         prenom: "Sophie",
//     },
// ];

import { useState, useEffect } from 'react';
import Footer from '../components/Footer';
import Header from '../components/Header';
import ContainerGestionLivret from '../components/ContainerGestionLivret';
import useUsersByFormation from '../hooks/useUsersByFormation';
import Loader from '../components/Loader';
import { useUserRole } from '../hooks/useUserRole';

export default function GestionLivret() {
    const { userId } = useUserRole();
    const { users, loading, error, fetchUsers } = useUsersByFormation(userId);
    const [allYears, setAllYears] = useState([]);

    useEffect(() => {
        if (users.length > 0) {
            const years = Array.from(new Set(users.map(user => user.annee)));
            setAllYears(years);
        }
    }, [users]);

    const sp_grouper_user_by_annee = allYears.reduce((acc, year) => {
        acc[year] = users.filter(user => user.annee === year);
        if (acc[year].length === 0 || (acc[year].length === 1 && acc[year][0].id_user === null)) {
            acc[year] = [{ id_user: null, nom: 'Aucun utilisateur', prenom: '', annee: year }];
        }
        return acc;
    }, {});

    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Header />
            <section className="section-gestion-livret">
                <h1 className="titre_page">Suivi des livrets</h1>
                <main className="main-gestion-livret" style={{ display: 'flex' }}>
                    {Object.keys(sp_grouper_user_by_annee).map((annee) => (
                        <ContainerGestionLivret
                            key={annee}
                            annee={annee}
                            users={sp_grouper_user_by_annee[annee]}
                        />
                    ))}
                </main>
            </section>
            <Footer />
        </>
    );
}

