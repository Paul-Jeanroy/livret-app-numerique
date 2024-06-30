import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { UserRoleProvider, useUserRole } from './hooks/useUserRole.jsx'; // Assurez-vous que l'extension est correcte

import Accueil from './pages/accueil';
import NotFound from './pages/notFound';
import Connexion from './pages/connexion';
import Profil from './pages/profil';
import Livret from './pages/livret';
import GestionLivret from './pages/gestionLivret';
import GestionUtilisateur from './pages/gestionUtilisateur';
import CreationTitre from './pages/creationTitre';
import GestionFormation from './pages/gestionFormation'
import Loader from './components/Loader.jsx';

const App = () => {
    const { roleUser, isLoading } = useUserRole();

    if (isLoading) {
        return <Loader />;
    }

    return (
        <Routes>
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/accueil" element={roleUser !== "" ? <Accueil /> : <Navigate to="/connexion" />} />
            <Route path="/profil" element={roleUser !== "" ? <Profil /> : <Navigate to="/connexion" />} />
            <Route path="/livret" element={roleUser !== "" ? <Livret /> : <Navigate to="/connexion" />} />
            <Route path="/gestionLivret" element={roleUser === "coordinateur" ? <GestionLivret /> : <Navigate to="/accueil" />} />
            <Route path="/gestionUtilisateur" element={roleUser === "coordinateur" ? <GestionUtilisateur /> : <Navigate to="/accueil" />} />
            <Route path="/creationTitre" element={roleUser === "coordinateur" ? <CreationTitre /> : <Navigate to="/accueil" />} />
            <Route path="/gestionFormation" element={roleUser == "coordinateur"? <GestionFormation /> : <Navigate to="/accueil" />} />
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
