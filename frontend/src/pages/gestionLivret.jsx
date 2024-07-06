/* Page GestionLivret : Permet l'affichage des utilisateurs permettant de consulter les livrets des apprenants

    Fonctionnalité :
    - sp_grouper_user_by_annee : Permet de grouper les utilisateurs par année.

*/

// Import REACT
import { useState, useEffect } from 'react';

// Import des composants
import Footer from '../components/Footer';
import Header from '../components/Header';
import ContainerGestionLivret from '../components/ContainerGestionLivret';

// Import des hooks personnalisés
import useUsersByFormation from '../hooks/useUsersByFormation';
import { useUserRole } from '../hooks/useUserRole';

export default function GestionLivret() {
    const { userId } = useUserRole();
    const { users } = useUsersByFormation(userId);
    const [w_tt_utilisateurs, setUtilisateurs] = useState([]);

    useEffect(() => {
        if (users.length > 0) {
            const w_annee = Array.from(new Set(users.map(user => user.annee)));
            setUtilisateurs(w_annee);
        }
    }, [users]);

    const sp_grouper_user_by_annee = w_tt_utilisateurs.reduce((o_tt_utilisateur, w_annee) => {
        o_tt_utilisateur[w_annee] = users.filter(user => user.annee === w_annee);
        if (o_tt_utilisateur[w_annee].length === 0 || (o_tt_utilisateur[w_annee].length === 1 && o_tt_utilisateur[w_annee][0].id_user === null)) {
            o_tt_utilisateur[w_annee] = [{ id_user: null, nom: 'Aucun utilisateur', prenom: '', annee: w_annee }];
        }
        return o_tt_utilisateur;
    }, {});

    return (
        <>
            <Header />
            <section className="section_gestion_livret">
                <h1 className="titre_page">Suivi des livrets</h1>
                <main style={{ display: 'flex' }}>
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

