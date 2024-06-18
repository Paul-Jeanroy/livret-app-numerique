import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Accueil from './pages/accueil';
import NotFound from './pages/notFound';
import Connexion from './pages/connexion';
import Profil from './pages/profil';
import Livret from './pages/livret';
import GestionLivret from './pages/gestionLivret';
import GestionUtilisateur from './pages/gestionUtilisateur';
import CreationTitre from './pages/creationTitre';

const App = () => {
    return (
        <Routes>
            <Route path="/connexion" element={<Connexion />} />
            <Route path="/accueil" element={<Accueil />} />
            <Route path="/profil" element={<Profil />} />
            <Route path="/livret" element={<Livret />} />
            <Route path="/gestionLivret" element={<GestionLivret />} />
            <Route path="/gestionUtilisateur" element={<GestionUtilisateur />} />
            <Route path="/creationTitre" element={<CreationTitre />} />
            <Route path="*" element={<NotFound />} />
        </Routes>
    );
};

const Root = () => (
    <Router>
        <App />
    </Router>
);

export default Root;
