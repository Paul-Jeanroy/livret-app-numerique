import { useState, useEffect } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ContainerGestionUtilisateur from "../components/ContainerGestionUtilisateur";
import { useUserRole } from "../hooks/useUserRole";
import useUsersByFormation from "../hooks/useUsersByFormation";
import PopupConfirmDeleteUser from "../components/PopupConfirmDeleteUser";
import PopupAjouterUser from "../components/PopupAjouterUser";
import Loader from "../components/Loader";

export default function GestionUtilisateur() {
    const { userId } = useUserRole();
    const { users, loading, error, setUsers, fetchUsers } = useUsersByFormation(userId);
    const [f_openDeletePopup, setDeletPopup] = useState(false);
    const [f_openAddPopup, setAddPopup] = useState(false);
    const [o_userToDelete, setUserToDelete] = useState(null);
    const [allYears, setAllYears] = useState([]);

    useEffect(() => {
        if (users.length > 0) {
            const years = Array.from(new Set(users.map(user => user.annee)));
            setAllYears(years);
        }
    }, [users]);

    const sp_supprimer_utilisateur = (userId) => {
        setUsers((prevUsers) => {
            const updatedUsers = prevUsers.filter(user => user.id_user !== userId);
            return updatedUsers;
        });
        setDeletPopup(false);
    };

    const sp_ajouter_utilisateur = (newUser) => {
        setUsers((prevUsers) => [...prevUsers, newUser]);
    };

    const sp_ouvrir_popup_delet = (user) => {
        setUserToDelete(user);
        setDeletPopup(true);
    };

    const sp_modifier_utilisateur = (updatedUser) => {
        setUsers((prevUsers) => prevUsers.map(user => user.id_user === updatedUser.id_user ? updatedUser : user));
    };

    // Regroupement des utilisateurs par année
    const sp_grouper_user_by_annee = allYears.reduce((acc, year) => {
        acc[year] = users.filter(user => user.annee === year);
        // Ajouter une entrée vide si l'année n'a pas d'utilisateurs valides
        if (acc[year].length === 0 || (acc[year].length === 1 && acc[year][0].id_user === null)) {
            acc[year] = [{ id_user: null, nom: "Aucun utilisateur", prenom: "", annee: year }];
        }
        return acc;
    }, {});

    if (loading) return <Loader />;
    if (error) return <div>Error: {error}</div>;

    return (
        <>
            <Header />
            <section className="section-gestion-utilisateur">
                <h1 className="titre_page"><span>Gestion des utilisateurs</span></h1>
                <div className="div-import-user">
                    <button type="file" className="btn-import-user">Importer d'utilisateurs</button>
                </div>
                <main className="main-gestion-utilisateur" style={{ display: "flex" }}>
                    {Object.keys(sp_grouper_user_by_annee).map((annee) => (
                        <ContainerGestionUtilisateur
                            key={annee}
                            annee={annee}
                            users={sp_grouper_user_by_annee[annee]}
                            onDeleteUser={sp_ouvrir_popup_delet}
                            onUpdateUser={sp_modifier_utilisateur}
                            onAddUser={sp_ajouter_utilisateur}
                            fetchUsers={fetchUsers}
                        />
                    ))}
                </main>
            </section>
            <Footer />

            {f_openAddPopup && (
                <PopupAjouterUser
                    setAddNewUser={setAddPopup}
                    annee={allYears}
                    onAddUser={sp_ajouter_utilisateur}
                />
            )}

            {f_openDeletePopup && (
                <PopupConfirmDeleteUser
                    setDeleteUser={setDeletPopup}
                    w_tt_data_delet_user={o_userToDelete}
                    onDelete={sp_supprimer_utilisateur}
                />
            )}
        </>
    );
}
