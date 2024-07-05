
/* Page Gestion utilisateur : Permet l'affichage d'un tableau de bord des utilisateurs d'une formation

    Par Paul Jeanroy et Hossame Laib

    Fonctionnalités :
    - sp_supprimmer_utilisateur : Permet de supprimer un utilisateur.
    - sp_ajouter_utilisateur    : Permet d'ajouter un utilisateur.
    - sp_ouvrir_popup_delet     : Permet d'ouvrir la popup de suppression d'un utilisateur.
    - sp_modifier_utilisateur   : Permet de modifier un utilisateur.
    - sp_grouper_user_by_annee  : Permet de grouper les utilisateurs par année.

*/

// Import REACT
import { useState, useEffect } from "react";

// Import des composants
import Footer from "../components/Footer";
import Header from "../components/Header";
import ContainerGestionUtilisateur from "../components/ContainerGestionUtilisateur";
import PopupConfirmDeleteUser from "../components/PopupConfirmDeleteUser";
import PopupAjouterUser from "../components/PopupAjouterUser";
import PopupAjouterAnnee from "../components/PopupAjouterAnnee"

// Import des hooks personnalisés
import { useUserRole } from "../hooks/useUserRole";
import useUsersByFormation from "../hooks/useUsersByFormation";


export default function GestionUtilisateur() {
    const { userId } = useUserRole();
    const { users, setUsers, fetchUsers } = useUsersByFormation(userId);
    const [f_openDeletePopup, setDeletPopup] = useState(false);
    const [f_openAddPopup, setAddPopup] = useState(false);
    const [f_openAddAnnee, setAddAnneePopup] = useState(false)
    const [o_userToDelete, setUserToDelete] = useState(null);
    const [w_tt_utilisateurs, setUtilisateurs] = useState([]);

    useEffect(() => {
        if (users.length > 0) {
            const w_annee = Array.from(new Set(users.map(user => user.annee)));
            setUtilisateurs(w_annee);
        }
    }, [users]);

    const sp_supprimer_utilisateur = (userId) => {
        setUsers((prevUsers) => {
            const o_utilisateurs = prevUsers.filter(user => user.id_user !== userId);
            return o_utilisateurs;
        });
        setDeletPopup(false);
    };

    const sp_ajouter_utilisateur = (o_nouvel_utilisateur) => {
        setUsers((prevUsers) => [...prevUsers, o_nouvel_utilisateur]);
    };

    const sp_ouvrir_popup_delet = (o_tt_utilisateur) => {
        setUserToDelete(o_tt_utilisateur);
        setDeletPopup(true);
    };

    const sp_modifier_utilisateur = (o_utilisateur) => {
        setUsers((prevUsers) => prevUsers.map(user => user.id_user === o_utilisateur.id_user ? o_utilisateur : user));
    };

    const sp_grouper_user_by_annee = w_tt_utilisateurs.reduce((o_tt_utilisateur, w_annee) => {
        o_tt_utilisateur[w_annee] = users.filter(user => user.annee === w_annee);
        if (o_tt_utilisateur[w_annee].length === 0 || (o_tt_utilisateur[w_annee].length === 1 && o_tt_utilisateur[w_annee][0].id_user === null)) {
            o_tt_utilisateur[w_annee] = [{ id_user: null, nom: "Aucun utilisateur", prenom: "", annee: w_annee }];
        }
        return o_tt_utilisateur;
    }, {});

    return (
        <>
            <Header />
            <section className="section-gestion-utilisateur">
                <h1 className="titre_page"><span>Gestion des utilisateurs</span></h1>
                <div className="div-import-user">
                    <button type="file" className="btn-ajout-classe" onClick={() => setAddAnneePopup(true)}>Ajouter une classe (année)</button>
                    {users.length === 0 && <p className="msg-aucun-apprenant">Aucun apprenant pour cette formation</p>}
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
                    annee={w_tt_utilisateurs}
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

            {f_openAddAnnee && (
                <PopupAjouterAnnee
                    setAddAnneePopup={setAddAnneePopup}
                    fetchUsers={fetchUsers}
                />
            )}
        </>
    );
}
