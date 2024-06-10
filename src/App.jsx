"use client";

import { BrowserRouter as Router, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";

import Accueil from "./pages/accueil";
import NotFound from "./pages/notFound";
import Connexion from "./pages/Connexion";
import Profil from "./pages/profil";
import Livret from "./pages/livret";

const App = () => {
  const navigate = useNavigate();

  // useEffect(() => {
  //   navigate("/accueil");
  // }, []);

  return (
    <Routes>
      <Route path="/accueil" element={<Accueil />} />
      <Route path="/connexion" element={<Connexion />} />
      <Route path="/profil" element={<Profil />} />
      <Route path="/livret" element={<Livret />} />
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
