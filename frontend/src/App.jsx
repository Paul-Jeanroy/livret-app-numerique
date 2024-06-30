import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { UserRoleProvider, useUserRole } from './hooks/useUserRole.jsx';
import { useEffect } from 'react';

import Accueil from './pages/accueil';
import NotFound from './pages/notFound';
import Connexion from './pages/connexion';
import Profil from './pages/profil';
import Livret from './pages/livret';
import GestionLivret from './pages/gestionLivret';
import GestionUtilisateur from './pages/gestionUtilisateur';
import CreationTitre from './pages/creationTitre';

const App = () => {
    const { roleUser } = useUserRole();
    const location = useLocation();
    const token = new URLSearchParams(location.search).get('token');

    useEffect(() => {
        if (token) {
            window.history.replaceState({}, '', '/reset-password?token=' + token);
        }
    }, [token]);

    return (
        <Routes>
            {/* Route accessible sans authentification */}
            <Route path="/reset-password" element={<Connexion />} />
            <Route path="/connexion" element={<Connexion />} />
            
            {/* Routes nécessitant authentification */}
            <Route path="/accueil" element={roleUser !== "" ? <Accueil /> : <Navigate to="/connexion" />} />
            <Route path="/profil" element={roleUser !== "" ? <Profil /> : <Navigate to="/connexion" />} />
            <Route path="/livret" element={roleUser !== "" ? <Livret /> : <Navigate to="/connexion" />} />
            <Route path="/gestionLivret" element={roleUser === "coordinateur" ? <GestionLivret /> : <Navigate to="/accueil" />} />
            <Route path="/gestionUtilisateur" element={roleUser === "coordinateur" ? <GestionUtilisateur /> : <Navigate to="/accueil" />} />
            <Route path="/creationTitre" element={roleUser === "coordinateur" ? <CreationTitre /> : <Navigate to="/accueil" />} />
            <Route path="*" element={roleUser !== "" ? <NotFound /> : <Navigate to="/connexion" />} />

            
        </Routes>
    );
};

const Root = () => (
    <Router>
        <UserRoleProvider>
            <App />
        </UserRoleProvider>
    </Router>
);

export default Root;
