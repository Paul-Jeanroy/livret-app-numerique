-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Hôte : 127.0.0.1:3306
-- Généré le : dim. 30 juin 2024 à 13:44
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
(4, 1, 'M2'),
(5, 2, 'M3'),
(6, 2, 'L3'),
(7, 2, 'M2');

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

--
-- Déchargement des données de la table `bloc_de_competences`
--

INSERT INTO `bloc_de_competences` (`id_bloc`, `nom`, `description`, `id_formation`) VALUES
(6, 'BLOC 1', 'BLOC 1 - Analyser la stratégie du SI', 2),
(7, 'BLOC 2', 'BLOC 2 – Concevoir, déployer et\ntester des solutions techniques', 2),
(8, 'BLOC 3', 'BLOC 3 - Manager des projets et des\nprogrammes dans des\nenvironnements complexes et\nmultidisciplinaires', 2),
(9, 'BLOC 4', 'BLOC 4 – Intégrer des projets\nd’entreprise faisant appel à des\ntechnologies innovantes et avancées.', 2),
(10, 'Bloc 5', 'Bloc 5 : Piloter un projet informatique\nen collaboration avec les parties\nprenantes.', 2);

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

--
-- Déchargement des données de la table `competence`
--

INSERT INTO `competence` (`id_competence`, `nom`, `description`, `id_bloc`) VALUES
(29, 'C1', 'C1 - Analyser la stratégie de l’entreprise en\nétudiant son environnement et son\nfonctionnement, afin d’être en capacité\nd’établir un diagnostic de son système\nd’information.', 6),
(30, 'C2', 'C2 - Établir un diagnostic du SI de l’entreprise ou\nde la situation technique, en identifiant ses\nforces et faiblesses, en décrivant ses processus\nmétiers et ses flux d’information, en décelant les\nécarts, afin de déterminer et de documenter les\néléments à maintenir ou à faire évoluer.', 6),
(31, 'C3', 'C3 - Déterminer les objectifs de l’organisation,\nen effectuant l’analyse d’un système\nd’information d’une organisation ou d’une\nsolution technique, en identifiant les missions à\nréaliser, l’équipe à constituer et les méthodes et\noutils à utiliser, afin de faire évoluer le SI ou la\nsolution technique.', 6),
(32, 'C4', 'C4 - Recueillir et formaliser les besoins des\nparties prenantes en analysant la mission et son\ncontexte, afin d’élaborer le cahier de charge de\nla solution à mettre en œuvre.', 7),
(33, 'C5.1', 'C5.1 - Définir les cas d’utilisation et concevoir les\nmodules formant la solution désirée et leurs\ninteractions, en prenant en compte l’existant, les\nbesoins des parties prenantes afin de retenir les\ntechnologies, les outils, et les méthodes\nadaptées.', 7),
(34, 'C5.2', 'C5.2 Proposer plusieurs architectures possibles\npour la solution désirée, en combinant les\ndifférents paramètres de conception (qualité,\ntemps, coût, etc.), afin de s’assurer que les\ndifférentes possibilités ont été envisagées.', 7),
(35, 'C6', 'C6 - Choisir l’architecture respectant les\nexigences, en tenant compte de sa robustesse,\nde sa complexité, des délais et des coûts, afin\nréaliser le système ou la solution finale, en\nintégrant les différents modules', 7),
(36, 'C7.1', 'C7.1 - Réaliser les tests des différents modules\nen déterminant les actions correctives à mettre\nen place, en vue de l’intégration des solutions\ndans la solution globale', 7),
(37, 'C7.2', 'C7.2 - Intégrer les différents modules et tester la\nsolution finale en considérant les exigences des\nparties prenantes et les scénarios identifiés, afin\nde valider la solution technique', 7),
(38, 'C8.1', 'C8.1 - Mettre en place une stratégie de\ndéploiement, en prenant en compte les\ncontraintes techniques et de performance, afin\nde déployer la solution dans son environnement\nde production.', 7),
(39, 'C8.2', 'C8.2 - Déployer la solution dans son\nenvironnement de production en préparant et\nen configurant son environnement, afin\nd’assurer un fonctionnement optimal', 7),
(40, 'C9.1', 'C9.1 - Piloter la mise en œuvre des solutions\nchoisies, en vérifiant leur intégration dans le\nsystème existant, et en implémentant une\nprocédure de gestion des changements, afin de\ngérer les aléas et s’assurer que les produits\nrespectent les exigences spécifiées', 7),
(41, 'C9.2', 'C9.2 - Gérer la continuité du service, en\nimplémentant une procédure de gestion des\nincidents, afin de garantir un fonctionnement\noptimal de la solution.', 7),
(42, 'C10.1', 'C10.1 - Identifier et définir le périmètre d’un\nprojet en l’analysant dans son environnement,\nafin d’intégrer les ressources, les contraintes, les\nexigences des parties prenantes et les risques', 8),
(43, 'C10.2', 'C10.2 - Choisir et déployer la démarche adaptée\npour la gestion du projet, en prenant en compte\nson périmètre, afin de réussir le projet', 8),
(44, 'C11.1', 'C11.1 - Allouer les ressources à disposition dans\nle cadre du projet en réalisant un suivi afin\nd’optimiser l’utilisation des ressources.', 8),
(45, 'C11.2', 'C11.2 - Mettre en place des environnements de\ngestion de projet, en utilisant des outils\nappropriés, afin de partager une vision\ncollaborative sur les activités du projet.', 8),
(46, 'C12', 'C12 - Analyser le volet business d’un projet en\nmettant en place une démarche\nentrepreneuriale, afin de prendre des décisions\nopportunes et favoriser l’innovation.', 8),
(47, 'C13', 'C13 - Répartir les actions en prenant en compte\nles compétences des membres de l’équipe et les\nfacteurs humains afin de manager efficacement\ndes équipes et atteindre les objectifs du projet', 8),
(48, 'C14', 'C14 - Étudier l’opportunité et la pertinence de\nfaire appel à des technologies avancées et\ninnovantes, en étudiant leur faisabilité et la\nvaleur apportée, afin de proposer des réponses\nà des besoins émergents de l’entreprise.', 9),
(49, 'C15', 'C15 - Identifier et intégrer des technologies\navancées et innovantes dès la phase de\nconception et d’architecture, en adoptant une\ndémarche de veille technologique, afin de saisir\nde nouvelles opportunités et pour proposer des\nsolutions en adéquation avec les exigences des\nparties prenantes', 9),
(50, 'C16', 'C16 - Préconiser une solution intégrant dès la\nphase de conception les contraintes légales et\nenvironnementales, en adoptant une démarche\nde veille et de sensibilisation, afin de proposer\ndes solutions en adéquation avec la\nréglementation en vigueur et la stratégie de\nl’entreprise', 9),
(51, 'C17.1', 'C17.1 - Choisir l’architecture adéquate, en\nanalysant et en comparant les différentes\npropositions, afin de réaliser et d’intégrer les\ndifférents modules qui constituent la solution\nfinale.', 9),
(52, 'C17.2', 'C17.2 - Tester la solution en adoptant des\ntechniques adaptées, afin de garantir la bonne\nintégration des technologies avancées et le bon\nfonctionnement de la solution apportée', 9),
(53, 'C18', 'C18 Initier un projet informatique, en présentant\nles principales étapes, en mobilisant les équipes,\nen organisant les ressources disponibles et en\nnégociant les moyens nécessaires, afin de\nfédérer les parties prenantes', 10),
(54, 'C19a', 'C19a Piloter l’avancement d’un projet\ninformatique auprès des parties prenantes, en\norganisant des réunions d’avancement et de\ncadrage, en résolvant les problématiques\ntechniques et les conflits inhérents au\nmanagement de projet, afin de lever les blocages\net de mener à bien la mission dans le délai\nimparti', 10),
(55, 'C19b', 'C19b Préparer une recette et la réaliser en\nprésence des parties prenantes afin d’obtenir la\nvalidation finale du projet A20 Rédiger un rapport de projet informatique,\nd’activités ou de mission, en synthétisant /\nvulgarisant / présentant un état de l’avancement\nafin de capitaliser les informations et\ncommuniquer vers les parties prenantes y\ncompris en langue anglaise.', 10),
(56, 'C21', 'C21 Organiser une veille technologique, en\nrecueillant et en analysant les sources\ndocumentaires et articles de recherche dans le\ndomaine des systèmes d’information, en\ndiffusant les résultats, et en s’auto-formant, afin\nde l’exploiter dans ses prestations', 10);

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
  `id_gerant_formation` int(11) NOT NULL,
  `periode` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `formation`
--

INSERT INTO `formation` (`id_formation`, `nom`, `code_rncp`, `niveau`, `id_gerant_formation`, `periode`) VALUES
(2, 'Manager en ingénierie informatique', 'RNCP35435', 'Niveau 7', 3, 'Trimestre');

-- --------------------------------------------------------

--
-- Structure de la table `livret_apprenti`
--

CREATE TABLE `livret_apprenti` (
  `id_livret` int(11) NOT NULL,
  `id_user` int(11) DEFAULT NULL,
  `id_formation` int(11) DEFAULT NULL,
  `annee_academique` varchar(10) DEFAULT NULL,
  `contenu` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- Structure de la table `livret_maitre_apprentissage`
--

CREATE TABLE `livret_maitre_apprentissage` (
  `id_livret` int(11) NOT NULL,
  `id_maitre_apprentissage` int(11) DEFAULT NULL,
  `id_formation` int(11) DEFAULT NULL,
  `id_apprenti` int(11) NOT NULL,
  `periode` varchar(10) DEFAULT NULL,
  `mission` text NOT NULL,
  `remarque` text DEFAULT NULL,
  `evaluation` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`evaluation`))
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- Déchargement des données de la table `livret_maitre_apprentissage`
--

INSERT INTO `livret_maitre_apprentissage` (`id_livret`, `id_maitre_apprentissage`, `id_formation`, `id_apprenti`, `periode`, `mission`, `remarque`, `evaluation`) VALUES
(1, 91, 2, 17, 'Trimestre', 'Création de site web interne a l\'entreprise', '', '[{\"competences\": [{\"description\": \"C1 - Analyser la strat\\u00e9gie de l\\u2019entreprise en\\n\\u00e9tudiant son environnement et son\\nfonctionnement, afin d\\u2019\\u00eatre en capacit\\u00e9\\nd\\u2019\\u00e9tablir un diagnostic de son syst\\u00e8me\\nd\\u2019information.\", \"id\": 29, \"nom\": \"C1\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}, {\"description\": \"C2 - \\u00c9tablir un diagnostic du SI de l\\u2019entreprise ou\\nde la situation technique, en identifiant ses\\nforces et faiblesses, en d\\u00e9crivant ses processus\\nm\\u00e9tiers et ses flux d\\u2019information, en d\\u00e9celant les\\n\\u00e9carts, afin de d\\u00e9terminer et de documenter les\\n\\u00e9l\\u00e9ments \\u00e0 maintenir ou \\u00e0 faire \\u00e9voluer.\", \"id\": 30, \"nom\": \"C2\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}, {\"description\": \"C3 - D\\u00e9terminer les objectifs de l\\u2019organisation,\\nen effectuant l\\u2019analyse d\\u2019un syst\\u00e8me\\nd\\u2019information d\\u2019une organisation ou d\\u2019une\\nsolution technique, en identifiant les missions \\u00e0\\nr\\u00e9aliser, l\\u2019\\u00e9quipe \\u00e0 constituer et les m\\u00e9thodes et\\noutils \\u00e0 utiliser, afin de faire \\u00e9voluer le SI ou la\\nsolution technique.\", \"id\": 31, \"nom\": \"C3\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}], \"description\": \"BLOC 1 - Analyser la strat\\u00e9gie du SI\", \"nom\": \"BLOC 1\"}, {\"competences\": [{\"description\": \"C4 - Recueillir et formaliser les besoins des\\nparties prenantes en analysant la mission et son\\ncontexte, afin d\\u2019\\u00e9laborer le cahier de charge de\\nla solution \\u00e0 mettre en \\u0153uvre.\", \"id\": 32, \"nom\": \"C4\", \"note\": \"20\", \"evaluation\": [false, false, false, false, true, false]}, {\"description\": \"C5.1 - D\\u00e9finir les cas d\\u2019utilisation et concevoir les\\nmodules formant la solution d\\u00e9sir\\u00e9e et leurs\\ninteractions, en prenant en compte l\\u2019existant, les\\nbesoins des parties prenantes afin de retenir les\\ntechnologies, les outils, et les m\\u00e9thodes\\nadapt\\u00e9es.\", \"id\": 33, \"nom\": \"C5.1\", \"note\": \"20\", \"evaluation\": [false, false, false, false, true, false]}, {\"description\": \"C5.2 Proposer plusieurs architectures possibles\\npour la solution d\\u00e9sir\\u00e9e, en combinant les\\ndiff\\u00e9rents param\\u00e8tres de conception (qualit\\u00e9,\\ntemps, co\\u00fbt, etc.), afin de s\\u2019assurer que les\\ndiff\\u00e9rentes possibilit\\u00e9s ont \\u00e9t\\u00e9 envisag\\u00e9es.\", \"id\": 34, \"nom\": \"C5.2\", \"note\": \"20\", \"evaluation\": [false, false, false, false, true, false]}, {\"description\": \"C6 - Choisir l\\u2019architecture respectant les\\nexigences, en tenant compte de sa robustesse,\\nde sa complexit\\u00e9, des d\\u00e9lais et des co\\u00fbts, afin\\nr\\u00e9aliser le syst\\u00e8me ou la solution finale, en\\nint\\u00e9grant les diff\\u00e9rents modules\", \"id\": 35, \"nom\": \"C6\", \"note\": \"20\", \"evaluation\": [false, false, false, false, true, false]}, {\"description\": \"C7.1 - R\\u00e9aliser les tests des diff\\u00e9rents modules\\nen d\\u00e9terminant les actions correctives \\u00e0 mettre\\nen place, en vue de l\\u2019int\\u00e9gration des solutions\\ndans la solution globale\", \"id\": 36, \"nom\": \"C7.1\", \"note\": \"20\", \"evaluation\": [false, false, false, false, true, false]}, {\"description\": \"C7.2 - Int\\u00e9grer les diff\\u00e9rents modules et tester la\\nsolution finale en consid\\u00e9rant les exigences des\\nparties prenantes et les sc\\u00e9narios identifi\\u00e9s, afin\\nde valider la solution technique\", \"id\": 37, \"nom\": \"C7.2\", \"note\": \"20\", \"evaluation\": [false, false, false, false, true, false]}, {\"description\": \"C8.1 - Mettre en place une strat\\u00e9gie de\\nd\\u00e9ploiement, en prenant en compte les\\ncontraintes techniques et de performance, afin\\nde d\\u00e9ployer la solution dans son environnement\\nde production.\", \"id\": 38, \"nom\": \"C8.1\", \"note\": \"20\", \"evaluation\": [false, false, false, false, true, false]}, {\"description\": \"C8.2 - D\\u00e9ployer la solution dans son\\nenvironnement de production en pr\\u00e9parant et\\nen configurant son environnement, afin\\nd\\u2019assurer un fonctionnement optimal\", \"id\": 39, \"nom\": \"C8.2\", \"note\": \"20\", \"evaluation\": [false, false, false, false, true, false]}, {\"description\": \"C9.1 - Piloter la mise en \\u0153uvre des solutions\\nchoisies, en v\\u00e9rifiant leur int\\u00e9gration dans le\\nsyst\\u00e8me existant, et en impl\\u00e9mentant une\\nproc\\u00e9dure de gestion des changements, afin de\\ng\\u00e9rer les al\\u00e9as et s\\u2019assurer que les produits\\nrespectent les exigences sp\\u00e9cifi\\u00e9es\", \"id\": 40, \"nom\": \"C9.1\", \"note\": \"20\", \"evaluation\": [false, false, false, false, true, false]}, {\"description\": \"C9.2 - G\\u00e9rer la continuit\\u00e9 du service, en\\nimpl\\u00e9mentant une proc\\u00e9dure de gestion des\\nincidents, afin de garantir un fonctionnement\\noptimal de la solution.\", \"id\": 41, \"nom\": \"C9.2\", \"note\": \"20\", \"evaluation\": [false, false, false, false, true, false]}], \"description\": \"BLOC 2 \\u2013 Concevoir, d\\u00e9ployer et\\ntester des solutions techniques\", \"nom\": \"BLOC 2\"}, {\"competences\": [{\"description\": \"C10.1 - Identifier et d\\u00e9finir le p\\u00e9rim\\u00e8tre d\\u2019un\\nprojet en l\\u2019analysant dans son environnement,\\nafin d\\u2019int\\u00e9grer les ressources, les contraintes, les\\nexigences des parties prenantes et les risques\", \"id\": 42, \"nom\": \"C10.1\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}, {\"description\": \"C10.2 - Choisir et d\\u00e9ployer la d\\u00e9marche adapt\\u00e9e\\npour la gestion du projet, en prenant en compte\\nson p\\u00e9rim\\u00e8tre, afin de r\\u00e9ussir le projet\", \"id\": 43, \"nom\": \"C10.2\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}, {\"description\": \"C11.1 - Allouer les ressources \\u00e0 disposition dans\\nle cadre du projet en r\\u00e9alisant un suivi afin\\nd\\u2019optimiser l\\u2019utilisation des ressources.\", \"id\": 44, \"nom\": \"C11.1\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}, {\"description\": \"C11.2 - Mettre en place des environnements de\\ngestion de projet, en utilisant des outils\\nappropri\\u00e9s, afin de partager une vision\\ncollaborative sur les activit\\u00e9s du projet.\", \"id\": 45, \"nom\": \"C11.2\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}, {\"description\": \"C12 - Analyser le volet business d\\u2019un projet en\\nmettant en place une d\\u00e9marche\\nentrepreneuriale, afin de prendre des d\\u00e9cisions\\nopportunes et favoriser l\\u2019innovation.\", \"id\": 46, \"nom\": \"C12\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}, {\"description\": \"C13 - R\\u00e9partir les actions en prenant en compte\\nles comp\\u00e9tences des membres de l\\u2019\\u00e9quipe et les\\nfacteurs humains afin de manager efficacement\\ndes \\u00e9quipes et atteindre les objectifs du projet\", \"id\": 47, \"nom\": \"C13\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}], \"description\": \"BLOC 3 - Manager des projets et des\\nprogrammes dans des\\nenvironnements complexes et\\nmultidisciplinaires\", \"nom\": \"BLOC 3\"}, {\"competences\": [{\"description\": \"C14 - \\u00c9tudier l\\u2019opportunit\\u00e9 et la pertinence de\\nfaire appel \\u00e0 des technologies avanc\\u00e9es et\\ninnovantes, en \\u00e9tudiant leur faisabilit\\u00e9 et la\\nvaleur apport\\u00e9e, afin de proposer des r\\u00e9ponses\\n\\u00e0 des besoins \\u00e9mergents de l\\u2019entreprise.\", \"id\": 48, \"nom\": \"C14\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}, {\"description\": \"C15 - Identifier et int\\u00e9grer des technologies\\navanc\\u00e9es et innovantes d\\u00e8s la phase de\\nconception et d\\u2019architecture, en adoptant une\\nd\\u00e9marche de veille technologique, afin de saisir\\nde nouvelles opportunit\\u00e9s et pour proposer des\\nsolutions en ad\\u00e9quation avec les exigences des\\nparties prenantes\", \"id\": 49, \"nom\": \"C15\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}, {\"description\": \"C16 - Pr\\u00e9coniser une solution int\\u00e9grant d\\u00e8s la\\nphase de conception les contraintes l\\u00e9gales et\\nenvironnementales, en adoptant une d\\u00e9marche\\nde veille et de sensibilisation, afin de proposer\\ndes solutions en ad\\u00e9quation avec la\\nr\\u00e9glementation en vigueur et la strat\\u00e9gie de\\nl\\u2019entreprise\", \"id\": 50, \"nom\": \"C16\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}, {\"description\": \"C17.1 - Choisir l\\u2019architecture ad\\u00e9quate, en\\nanalysant et en comparant les diff\\u00e9rentes\\npropositions, afin de r\\u00e9aliser et d\\u2019int\\u00e9grer les\\ndiff\\u00e9rents modules qui constituent la solution\\nfinale.\", \"id\": 51, \"nom\": \"C17.1\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}, {\"description\": \"C17.2 - Tester la solution en adoptant des\\ntechniques adapt\\u00e9es, afin de garantir la bonne\\nint\\u00e9gration des technologies avanc\\u00e9es et le bon\\nfonctionnement de la solution apport\\u00e9e\", \"id\": 52, \"nom\": \"C17.2\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}], \"description\": \"BLOC 4 \\u2013 Int\\u00e9grer des projets\\nd\\u2019entreprise faisant appel \\u00e0 des\\ntechnologies innovantes et avanc\\u00e9es.\", \"nom\": \"BLOC 4\"}, {\"competences\": [{\"description\": \"C18 Initier un projet informatique, en pr\\u00e9sentant\\nles principales \\u00e9tapes, en mobilisant les \\u00e9quipes,\\nen organisant les ressources disponibles et en\\nn\\u00e9gociant les moyens n\\u00e9cessaires, afin de\\nf\\u00e9d\\u00e9rer les parties prenantes\", \"id\": 53, \"nom\": \"C18\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}, {\"description\": \"C19a Piloter l\\u2019avancement d\\u2019un projet\\ninformatique aupr\\u00e8s des parties prenantes, en\\norganisant des r\\u00e9unions d\\u2019avancement et de\\ncadrage, en r\\u00e9solvant les probl\\u00e9matiques\\ntechniques et les conflits inh\\u00e9rents au\\nmanagement de projet, afin de lever les blocages\\net de mener \\u00e0 bien la mission dans le d\\u00e9lai\\nimparti\", \"id\": 54, \"nom\": \"C19a\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}, {\"description\": \"C19b Pr\\u00e9parer une recette et la r\\u00e9aliser en\\npr\\u00e9sence des parties prenantes afin d\\u2019obtenir la\\nvalidation finale du projet A20 R\\u00e9diger un rapport de projet informatique,\\nd\\u2019activit\\u00e9s ou de mission, en synth\\u00e9tisant /\\nvulgarisant / pr\\u00e9sentant un \\u00e9tat de l\\u2019avancement\\nafin de capitaliser les informations et\\ncommuniquer vers les parties prenantes y\\ncompris en langue anglaise.\", \"id\": 55, \"nom\": \"C19b\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}, {\"description\": \"C21 Organiser une veille technologique, en\\nrecueillant et en analysant les sources\\ndocumentaires et articles de recherche dans le\\ndomaine des syst\\u00e8mes d\\u2019information, en\\ndiffusant les r\\u00e9sultats, et en s\\u2019auto-formant, afin\\nde l\\u2019exploiter dans ses prestations\", \"id\": 56, \"nom\": \"C21\", \"evaluation\": [false, false, false, false, true, false], \"note\": \"20\"}], \"description\": \"Bloc 5 : Piloter un projet informatique\\nen collaboration avec les parties\\nprenantes.\", \"nom\": \"Bloc 5\"}]');

-- --------------------------------------------------------

--
-- Structure de la table `supervisions`
--

CREATE TABLE `supervisions` (
  `id_supervision` int(11) NOT NULL,
  `id_apprenti` int(11) NOT NULL,
  `id_maitre_apprentissage` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Déchargement des données de la table `supervisions`
--

INSERT INTO `supervisions` (`id_supervision`, `id_apprenti`, `id_maitre_apprentissage`) VALUES
(1, 17, 91);

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
(3, 'titi', 'dev', 'dev@dev.fr', '$2b$12$aeE05ERQgpFFgGmAnqI2euoXSTQ/XuRs80DErg0Zu3Wc01QXPwfoC', 'coordinateur', '2024-06-18 19:42:19', 1, 1, 3, 1),
(17, 'jeanroy', 'paul', 'pauljeanroy@outlook.fr', '$2b$12$wK1q3E0roTNf133XvQ36DurCeqHoRrorPp.9AuN4cKJAIQ2Sau2gG', 'apprenti', '2024-06-21 12:40:00', 1, 2, 3, 1),
(91, 'ma', 'mapp', 'ma@ma.fr', '$2b$12$euxRvoZWS8Ah2PfWr1b0yu9aGiWwMu0xkr9NS3xV/1XzQbOrSmTgC', 'maître d\'apprentissage', '2024-06-28 11:24:57', 1, NULL, NULL, NULL),
(92, 'bastien', 'laib', 'laibhossame1@gmail.com', '$2b$12$BOU9QK6VVXK6aSSF3BP8beOuILwOWLxuR3jkHURL8WoZbHUC3HZYy', 'apprenti', '2024-06-28 11:48:14', 1, 1, 3, 3),
(100, 'ds', 'dsqd', 'dd@dev.fr', '$2b$12$ZFVaekeC06aDY2HMKwnzfevjCa.lh64d9XgLkVZvtzGLeAPjRG.Zm', 'apprenti', '2024-06-30 11:41:11', 1, 2, 3, 7),
(101, 'fdsg', 'sdf', 'test1@test.fr', '$2b$12$Fr/IJBihJLsG8yy7qELUkOrAnGO3oOBnMo/U9wJ2T6V.7xm0NYska', 'apprenti', '2024-06-30 11:42:04', 1, 2, 3, 7),
(102, 'lolo', 'toto', 'toto@gmail.com', '$2b$12$oe.PlSYHpu2/oceF0UcPy.OujTerFHGwdnB8XeY2HlW.t70kssjJG', 'apprenti', '2024-06-30 11:43:51', 1, 2, 3, 6),
(103, 'george', 'mimi', 'hossamelaib13@gmail.com', '$2b$12$w4tu1vL2LS2toTsODnUwAu/SuAInHc79.M3f9RXtnzV/pS2y4NinG', 'apprenti', '2024-06-30 11:48:11', 1, 2, 3, 6);

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
  ADD KEY `id_maitre_apprentissage` (`id_maitre_apprentissage`),
  ADD KEY `id_formation` (`id_formation`),
  ADD KEY `id_apprenti` (`id_apprenti`);

--
-- Index pour la table `supervisions`
--
ALTER TABLE `supervisions`
  ADD PRIMARY KEY (`id_supervision`),
  ADD KEY `id_apprenti` (`id_apprenti`),
  ADD KEY `id_maitre_apprentissage` (`id_maitre_apprentissage`);

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
  MODIFY `id_annee` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT pour la table `bloc_de_competences`
--
ALTER TABLE `bloc_de_competences`
  MODIFY `id_bloc` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT pour la table `competence`
--
ALTER TABLE `competence`
  MODIFY `id_competence` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=57;

--
-- AUTO_INCREMENT pour la table `evaluation`
--
ALTER TABLE `evaluation`
  MODIFY `id_eval` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `formation`
--
ALTER TABLE `formation`
  MODIFY `id_formation` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT pour la table `livret_apprenti`
--
ALTER TABLE `livret_apprenti`
  MODIFY `id_livret` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT pour la table `livret_maitre_apprentissage`
--
ALTER TABLE `livret_maitre_apprentissage`
  MODIFY `id_livret` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `supervisions`
--
ALTER TABLE `supervisions`
  MODIFY `id_supervision` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT pour la table `utilisateurs`
--
ALTER TABLE `utilisateurs`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=104;

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
-- Contraintes pour la table `supervisions`
--
ALTER TABLE `supervisions`
  ADD CONSTRAINT `fk_id_apprenti` FOREIGN KEY (`id_apprenti`) REFERENCES `utilisateurs` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_id_maitre_apprentissage` FOREIGN KEY (`id_maitre_apprentissage`) REFERENCES `utilisateurs` (`id_user`) ON DELETE CASCADE ON UPDATE CASCADE;

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
