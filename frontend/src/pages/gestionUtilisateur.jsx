import { useState } from "react";
import Footer from "../components/Footer";
import Header from "../components/Header";
import ContainerGestionUtilisateur from "../components/ContainerGestionUtilisateur";
import { useUserRole } from "../hooks/useUserRole";
import useUsersByFormation from "../hooks/useUsersByFormation";
import PopupConfirmDeleteUser from "../components/PopupConfirmDeleteUser";
import PopupAjouterUser from "../components/PopupAjouterUser";

export default function GestionUtilisateur() {
    const { userId } = useUserRole();
    const { users, setUsers, fetchUsers } = useUsersByFormation(userId);
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [showAddPopup, setShowAddPopup] = useState(false);
    const [userToDelete, setUserToDelete] = useState(null);

    const handleDeleteUser = (userId) => {
        setUsers((prevUsers) => prevUsers.filter(user => user.id_user !== userId));
        setShowDeletePopup(false);
    };

    const handleAddUser = (newUser) => {
        setUsers((prevUsers) => [...prevUsers, newUser]);
    };

    const openDeletePopup = (user) => {
        setUserToDelete(user);
        setShowDeletePopup(true);
    };

    // updateUser
    const handleUpdateUser = (updatedUser) => {
        setUsers((prevUsers) => prevUsers.map(user => user.id_user === updatedUser.id_user ? updatedUser : user));
    };

    // Regroupement des utilisateurs par année
    const usersByYear = users.reduce((acc, user) => {
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
                        <ContainerGestionUtilisateur 
                            key={annee} 
                            annee={annee} 
                            users={usersByYear[annee]} 
                            onDeleteUser={openDeletePopup}
                            onUpdateUser={handleUpdateUser} 
                            onAddUser={handleAddUser}
                            fetchUsers={fetchUsers}
                        />
                    ))}
                </main>
            </section>
            <Footer />

            {showAddPopup && (
                <PopupAjouterUser 
                    setAddNewUser={setShowAddPopup} 
                    annee={usersByYear} 
                    onAddUser={handleAddUser} 
                />
            )}

            {showDeletePopup && (
                <PopupConfirmDeleteUser 
                    setDeleteUser={setShowDeletePopup} 
                    w_tt_data_delet_user={userToDelete} 
                    onDelete={handleDeleteUser} 
                />
            )}
        </>
    );
}
