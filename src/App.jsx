"use client";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Accueil from "./pages/accueil";
import NotFound from "./pages/notFound";
import Connexion from "./pages/Connexion";
import Profil from "./pages/profil";
import Livret from "./pages/livret";
import GestionLivret from "./pages/gestionLivret"

const App = () => {


  return (
    <Routes>
      <Route path="/accueil" element={<Accueil />} />
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="/livret" element={<Livret />} />
      <Route path="/gestionLivret" element={<GestionLivret />} />
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
