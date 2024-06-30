-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : ven. 28 juin 2024 à 12:42
-- Version du serveur : 10.11.7-MariaDB-cll-lve
-- Version de PHP : 7.2.34

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données : `u115854924_bdd_livret_app`
--

-- --------------------------------------------------------

--
-- Structure de la table `annees`
--

CREATE TABLE `annees` (
  `id_annee` int(11) NOT NULL,
  `id_formation` int(11) NOT NULL,
  `annee` varchar(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `annees`
--

INSERT INTO `annees` (`id_annee`, `id_formation`, `annee`) VALUES
(1, 1, 'L3'),
(3, 1, 'M1'),
(4, 1, 'M2');

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
  `code_rncp` varchar(255) NOT NULL,
  `niveau` varchar(255) DEFAULT NULL,
  `id_gerant_formation` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `formation`
--

INSERT INTO `formation` (`id_formation`, `nom`, `code_rncp`, `niveau`, `id_gerant_formation`) VALUES
(1, 'Manager en ingenierie informatique', '35435', 'Niveau 7', 3);

-- --------------------------------------------------------

--
-- Structure de la table `livret_apprenti`
--

CREATE TABLE `livret_apprenti` (
  `id_livret` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_formation` int(11) DEFAULT NULL,
  `annee_academique` varchar(10) DEFAULT NULL,
  `periode` varchar(50) DEFAULT NULL,
  `contenu` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `livret_maitre_apprentissage`
--

CREATE TABLE `livret_maitre_apprentissage` (
  `id_livret` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_formation` int(11) DEFAULT NULL,
  `annee_academique` varchar(10) DEFAULT NULL,
  `periode` varchar(50) DEFAULT NULL,
  `evaluation` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

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
  `date_de_Création` timestamp NOT NULL DEFAULT current_timestamp(),
  `est_valide` tinyint(1) NOT NULL,
  `id_formation` int(11) DEFAULT NULL,
  `id_gerant` int(11) DEFAULT NULL,
  `id_annee` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `utilisateurs`
--

INSERT INTO `utilisateurs` (`id_user`, `nom`, `prenom`, `email`, `password`, `role`, `date_de_Création`, `est_valide`, `id_formation`, `id_gerant`, `id_annee`) VALUES
(3, 'toto', 'dev', 'dev@dev.fr', '$2b$12$aeE05ERQgpFFgGmAnqI2euoXSTQ/XuRs80DErg0Zu3Wc01QXPwfoC', 'coordinateur', '2024-06-18 19:42:19', 1, 1, 3, 1),
(17, 'jeanroy', 'paul', 'pauljeanroy@outlook.fr', '$2b$12$wK1q3E0roTNf133XvQ36DurCeqHoRrorPp.9AuN4cKJAIQ2Sau2gG', 'apprenti', '2024-06-21 12:40:00', 1, 1, 3, 1),
(91, 'ma', 'mapp', 'ma@ma.fr', '$2b$12$euxRvoZWS8Ah2PfWr1b0yu9aGiWwMu0xkr9NS3xV/1XzQbOrSmTgC', 'maître d\'apprentissage', '2024-06-28 11:24:57', 1, NULL, NULL, NULL),
(92, 'jerome', 'laib', 'laibhossame1@gmail.com', '$2b$12$aKjZvTQP8Quw93SxBpNUHOotL.VSkkRx9mVIRYqEr1IhvQGLEqX7W', 'apprenti', '2024-06-28 11:48:14', 1, 1, 3, 3);

--
-- Index pour les tables déchargées
--

--
-- Index pour la table `annees`
--
ALTER TABLE `annees`
  ADD PRIMARY KEY (`id_annee`),
  ADD KEY `fk_id_formation_annees` (`id_formation`);

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
  ADD PRIMARY KEY (`id_formation`),
  ADD KEY `fk_id_gerant_formation` (`id_gerant_formation`);

--
-- Index pour la table `livret_apprenti`
--
ALTER TABLE `livret_apprenti`
  ADD PRIMARY KEY (`id_livret`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_formation` (`id_formation`);

--
-- Index pour la table `livret_maitre_apprentissage`
--
ALTER TABLE `livret_maitre_apprentissage`
  ADD PRIMARY KEY (`id_livret`),
  ADD KEY `id_user` (`id_user`),
  ADD KEY `id_formation` (`id_formation`);

--
-- Index pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD PRIMARY KEY (`id_user`),
  ADD KEY `fk_id_formation` (`id_formation`),
  ADD KEY `fk_id_gerant` (`id_gerant`),
  ADD KEY `fk_id_annee_utilisateurs` (`id_annee`);

--
-- AUTO_INCREMENT pour les tables déchargées
--

--
-- AUTO_INCREMENT pour la table `annees`
--
ALTER TABLE `annees`
  MODIFY `id_annee` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

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
  MODIFY `id_formation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `livret_apprenti`
--
ALTER TABLE `livret_apprenti`
  MODIFY `id_livret` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `livret_maitre_apprentissage`
--
ALTER TABLE `livret_maitre_apprentissage`
  MODIFY `id_livret` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=93;

--
-- Contraintes pour les tables déchargées
--

--
-- Contraintes pour la table `annees`
--
ALTER TABLE `annees`
  ADD CONSTRAINT `fk_id_formation_annees` FOREIGN KEY (`id_formation`) REFERENCES `formation` (`id_formation`) ON DELETE CASCADE ON UPDATE CASCADE;

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
-- Contraintes pour la table `formation`
--
ALTER TABLE `formation`
  ADD CONSTRAINT `fk_id_gerant_formation` FOREIGN KEY (`id_gerant_formation`) REFERENCES `utilisateurs` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Contraintes pour la table `livret_apprenti`
--
ALTER TABLE `livret_apprenti`
  ADD CONSTRAINT `livret_apprenti_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `utilisateurs` (`id_user`),
  ADD CONSTRAINT `livret_apprenti_ibfk_2` FOREIGN KEY (`id_formation`) REFERENCES `formation` (`id_formation`);

--
-- Contraintes pour la table `livret_maitre_apprentissage`
--
ALTER TABLE `livret_maitre_apprentissage`
  ADD CONSTRAINT `livret_maitre_apprentissage_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `utilisateurs` (`id_user`),
  ADD CONSTRAINT `livret_maitre_apprentissage_ibfk_2` FOREIGN KEY (`id_formation`) REFERENCES `formation` (`id_formation`);

--
-- Contraintes pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  ADD CONSTRAINT `fk_id_annee_utilisateurs` FOREIGN KEY (`id_annee`) REFERENCES `annees` (`id_annee`) ON DELETE SET NULL ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_id_formation` FOREIGN KEY (`id_formation`) REFERENCES `formation` (`id_formation`) ON DELETE NO ACTION ON UPDATE NO ACTION,
  ADD CONSTRAINT `fk_id_gerant` FOREIGN KEY (`id_gerant`) REFERENCES `utilisateurs` (`id_user`) ON DELETE NO ACTION ON UPDATE NO ACTION;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
