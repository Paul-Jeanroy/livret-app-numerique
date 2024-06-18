-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1
-- Généré le : mar. 18 juin 2024 à 21:18
-- Version du serveur : 10.4.32-MariaDB
-- Version de PHP : 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `livret-app-num`
--

-- --------------------------------------------------------

--
-- Structure de la table `bloc_de_competences`
--

CREATE TABLE `bloc_de_competences` (
  `id_bloc` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `id_formation` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `competence`
--

CREATE TABLE `competence` (
  `id_competence` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `id_bloc` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `evaluation`
--

CREATE TABLE `evaluation` (
  `id_eval` int(11) NOT NULL,
  `id_livret` int(11) DEFAULT NULL,
  `id_competence` int(11) DEFAULT NULL,
  `note` decimal(5,2) DEFAULT NULL,
  `commentaire` text DEFAULT NULL,
  `date_eval` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `formation`
--

CREATE TABLE `formation` (
  `id_formation` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `code_rncp` varchar(255) NOT NULL,
  `niveau` varchar(255) DEFAULT NULL,
  `duree` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `livret`
--

CREATE TABLE `livret` (
  `id_livret` int(11) NOT NULL,
  `id_apprenti` int(11) DEFAULT NULL,
  `id_maitre_apprentissage` int(11) DEFAULT NULL,
  `id_formation` int(11) DEFAULT NULL,
  `date_debut` date DEFAULT NULL,
  `date_fin` date DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Structure de la table `utilisateurs`
--

CREATE TABLE `utilisateurs` (
  `id_user` int(11) NOT NULL,
  `nom` varchar(255) NOT NULL,
  `prenom` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `role` enum('coordinateur','maître d''apprentissage','apprenti') NOT NULL,
  `date_de_Création` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id_user`, `nom`, `prenom`, `email`, `password`, `role`, `date_de_Création`) VALUES
(1, 'jeanroy', 'paul', 'pauljeanroy@outlook.fr', '$2b$12$Ev/XYswbL5bvSNXgz5gFmu1vkqYAA7ZwuMHYrApG2k7W0UDSzyqMy', 'apprenti', '2024-06-17 18:28:52'),
(2, 'laib', 'hossame', 'hossame@ep.fr', '$2b$12$JRzLVkFUyEQ9RcfaGeBrEuxFYqN.Z7jUIMwNVehp.n46zsGGlgQle', 'apprenti', '2024-06-17 18:29:27');

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `bloc_de_competences`
--
ALTER TABLE `bloc_de_competences`
  ADD PRIMARY KEY (`id_bloc`),
  ADD KEY `id_formation` (`id_formation`);

--
-- Index pour la table `competence`
--
ALTER TABLE `competence`
  ADD PRIMARY KEY (`id_competence`),
  ADD KEY `id_bloc` (`id_bloc`);

--
-- Index pour la table `evaluation`
--
ALTER TABLE `evaluation`
  ADD PRIMARY KEY (`id_eval`),
  ADD KEY `id_livret` (`id_livret`),
  ADD KEY `id_competence` (`id_competence`);

--
-- Index pour la table `formation`
--
ALTER TABLE `formation`
  ADD PRIMARY KEY (`id_formation`);

--
-- Index pour la table `livret`
--
ALTER TABLE `livret`
  ADD PRIMARY KEY (`id_livret`),
  ADD KEY `id_apprenti` (`id_apprenti`),
  ADD KEY `id_maitre_apprentissage` (`id_maitre_apprentissage`),
  ADD KEY `id_formation` (`id_formation`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `bloc_de_competences`
--
ALTER TABLE `bloc_de_competences`
  MODIFY `id_bloc` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `competence`
--
ALTER TABLE `competence`
  MODIFY `id_competence` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `evaluation`
--
ALTER TABLE `evaluation`
  MODIFY `id_eval` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `formation`
--
ALTER TABLE `formation`
  MODIFY `id_formation` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `livret`
--
ALTER TABLE `livret`
  MODIFY `id_livret` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `bloc_de_competences`
--
ALTER TABLE `bloc_de_competences`
  ADD CONSTRAINT `bloc_de_competences_ibfk_1` FOREIGN KEY (`id_formation`) REFERENCES `formation` (`id_formation`);

--
-- Contraintes pour la table `competence`
--
ALTER TABLE `competence`
  ADD CONSTRAINT `competence_ibfk_1` FOREIGN KEY (`id_bloc`) REFERENCES `bloc_de_competences` (`id_bloc`);

--
-- Contraintes pour la table `evaluation`
--
ALTER TABLE `evaluation`
  ADD CONSTRAINT `evaluation_ibfk_1` FOREIGN KEY (`id_livret`) REFERENCES `livret` (`id_livret`),
  ADD CONSTRAINT `evaluation_ibfk_2` FOREIGN KEY (`id_competence`) REFERENCES `competence` (`id_competence`);

--
-- Contraintes pour la table `livret`
--
ALTER TABLE `livret`
  ADD CONSTRAINT `livret_ibfk_1` FOREIGN KEY (`id_apprenti`) REFERENCES `utilisateurs` (`id_user`),
  ADD CONSTRAINT `livret_ibfk_2` FOREIGN KEY (`id_maitre_apprentissage`) REFERENCES `utilisateurs` (`id_user`),
  ADD CONSTRAINT `livret_ibfk_3` FOREIGN KEY (`id_formation`) REFERENCES `formation` (`id_formation`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
