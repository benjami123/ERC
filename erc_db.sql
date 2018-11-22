-- phpMyAdmin SQL Dump
-- version 4.6.4
-- https://www.phpmyadmin.net/
--
-- Client :  127.0.0.1
-- Généré le :  Jeu 22 Novembre 2018 à 10:10
-- Version du serveur :  5.7.14
-- Version de PHP :  5.6.25

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de données :  `erc_db`
--

-- --------------------------------------------------------

--
-- Structure de la table `part`
--

CREATE TABLE `part` (
  `IdPart` int(255) NOT NULL,
  `IdSupplier` int(255) NOT NULL,
  `Name` text COLLATE utf8_bin NOT NULL,
  `Description` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `partimplemented`
--

CREATE TABLE `partimplemented` (
  `IdPartImplemented` int(255) NOT NULL,
  `IdPlant` int(255) NOT NULL,
  `IdPart` int(255) NOT NULL,
  `Price` int(255) NOT NULL,
  `LifeTime_Mean` float NOT NULL,
  `LifeTime_Variance` float NOT NULL,
  `isImplemented` tinyint(1) NOT NULL,
  `location` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `part_offer`
--

CREATE TABLE `part_offer` (
  `IdPart_Offer` int(255) NOT NULL,
  `IdPartImplemented` int(255) NOT NULL,
  `DateStart` date NOT NULL,
  `DateOffer` date NOT NULL,
  `Price` int(255) NOT NULL,
  `Type` int(1) NOT NULL,
  `State` int(1) NOT NULL,
  `UserSeen` tinyint(1) NOT NULL,
  `Offer` text COLLATE utf8_bin NOT NULL,
  `OrderFromClient` text COLLATE utf8_bin NOT NULL,
  `OrderFromERC` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `plant`
--

CREATE TABLE `plant` (
  `IdPlant` int(255) NOT NULL,
  `Name` text COLLATE utf8_bin NOT NULL,
  `Email` text COLLATE utf8_bin NOT NULL,
  `TypicialDeliveryTime` int(255) NOT NULL,
  `Address` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `ra_offer`
--

CREATE TABLE `ra_offer` (
  `IdRA_Offer` int(255) NOT NULL,
  `IdReductionAgent` int(255) NOT NULL,
  `DateStart` date NOT NULL,
  `DateAccepted` date NOT NULL,
  `QuantityInL` int(255) NOT NULL,
  `Price` int(255) NOT NULL,
  `Receipt` text COLLATE utf8_bin NOT NULL,
  `UserSeen` tinyint(1) NOT NULL,
  `OrderFromClient` text COLLATE utf8_bin NOT NULL,
  `OrderFromERC` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `reductionagent`
--

CREATE TABLE `reductionagent` (
  `IdReductionAgent` int(255) NOT NULL,
  `IdPlant` int(255) NOT NULL,
  `PricePerL` float NOT NULL,
  `LevelofRAInL` int(255) NOT NULL,
  `TotalCapacityInL` float NOT NULL,
  `LevelOfRAInPercent` float NOT NULL,
  `AverageCunsumption` float NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `review`
--

CREATE TABLE `review` (
  `IdReview` int(255) NOT NULL,
  `IdPartImplemented` int(255) NOT NULL,
  `- Date` date NOT NULL,
  `Type` int(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `supplier`
--

CREATE TABLE `supplier` (
  `IdSupplier` int(255) NOT NULL,
  `Email` text COLLATE utf8_bin NOT NULL,
  `Number` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

-- --------------------------------------------------------

--
-- Structure de la table `user`
--

CREATE TABLE `user` (
  `IdUser` int(255) NOT NULL,
  `IdPlant` int(255) NOT NULL,
  `Login` text COLLATE utf8_bin NOT NULL,
  `Password` text COLLATE utf8_bin NOT NULL,
  `Email` text COLLATE utf8_bin NOT NULL,
  `Role` int(1) NOT NULL,
  `isAdmin` tinyint(1) NOT NULL,
  `isConnected` tinyint(1) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Index pour les tables exportées
--

--
-- Index pour la table `part`
--
ALTER TABLE `part`
  ADD PRIMARY KEY (`IdPart`),
  ADD KEY `IDSupplier` (`IdSupplier`);

--
-- Index pour la table `partimplemented`
--
ALTER TABLE `partimplemented`
  ADD PRIMARY KEY (`IdPartImplemented`),
  ADD KEY `IdPlant` (`IdPlant`),
  ADD KEY `IdPart` (`IdPart`),
  ADD KEY `IdPart_2` (`IdPart`),
  ADD KEY `IdPlant_2` (`IdPlant`);

--
-- Index pour la table `part_offer`
--
ALTER TABLE `part_offer`
  ADD PRIMARY KEY (`IdPart_Offer`),
  ADD UNIQUE KEY `IdPartImplemented` (`IdPartImplemented`);

--
-- Index pour la table `plant`
--
ALTER TABLE `plant`
  ADD PRIMARY KEY (`IdPlant`);

--
-- Index pour la table `ra_offer`
--
ALTER TABLE `ra_offer`
  ADD PRIMARY KEY (`IdRA_Offer`),
  ADD KEY `IdReductionAgent` (`IdReductionAgent`);

--
-- Index pour la table `reductionagent`
--
ALTER TABLE `reductionagent`
  ADD PRIMARY KEY (`IdReductionAgent`),
  ADD KEY `IdPlant` (`IdPlant`);

--
-- Index pour la table `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`IdReview`),
  ADD KEY `IdPartImplemented` (`IdPartImplemented`);

--
-- Index pour la table `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`IdSupplier`);

--
-- Index pour la table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`IdUser`),
  ADD UNIQUE KEY `IdPlant` (`IdPlant`);

--
-- AUTO_INCREMENT pour les tables exportées
--

--
-- AUTO_INCREMENT pour la table `part`
--
ALTER TABLE `part`
  MODIFY `IdPart` int(255) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `partimplemented`
--
ALTER TABLE `partimplemented`
  MODIFY `IdPartImplemented` int(255) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `part_offer`
--
ALTER TABLE `part_offer`
  MODIFY `IdPart_Offer` int(255) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `plant`
--
ALTER TABLE `plant`
  MODIFY `IdPlant` int(255) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `ra_offer`
--
ALTER TABLE `ra_offer`
  MODIFY `IdRA_Offer` int(255) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `reductionagent`
--
ALTER TABLE `reductionagent`
  MODIFY `IdReductionAgent` int(255) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `review`
--
ALTER TABLE `review`
  MODIFY `IdReview` int(255) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `supplier`
--
ALTER TABLE `supplier`
  MODIFY `IdSupplier` int(255) NOT NULL AUTO_INCREMENT;
--
-- AUTO_INCREMENT pour la table `user`
--
ALTER TABLE `user`
  MODIFY `IdUser` int(255) NOT NULL AUTO_INCREMENT;
--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `part`
--
ALTER TABLE `part`
  ADD CONSTRAINT `part_ibfk_1` FOREIGN KEY (`IdSupplier`) REFERENCES `supplier` (`IdSupplier`);

--
-- Contraintes pour la table `partimplemented`
--
ALTER TABLE `partimplemented`
  ADD CONSTRAINT `partimplemented_ibfk_1` FOREIGN KEY (`IdPlant`) REFERENCES `plant` (`IdPlant`),
  ADD CONSTRAINT `partimplemented_ibfk_2` FOREIGN KEY (`IdPart`) REFERENCES `part` (`IdPart`);

--
-- Contraintes pour la table `part_offer`
--
ALTER TABLE `part_offer`
  ADD CONSTRAINT `part_offer_ibfk_1` FOREIGN KEY (`IdPartImplemented`) REFERENCES `partimplemented` (`IdPartImplemented`);

--
-- Contraintes pour la table `ra_offer`
--
ALTER TABLE `ra_offer`
  ADD CONSTRAINT `ra_offer_ibfk_1` FOREIGN KEY (`IdReductionAgent`) REFERENCES `reductionagent` (`IdReductionAgent`);

--
-- Contraintes pour la table `reductionagent`
--
ALTER TABLE `reductionagent`
  ADD CONSTRAINT `reductionagent_ibfk_1` FOREIGN KEY (`IdPlant`) REFERENCES `plant` (`IdPlant`);

--
-- Contraintes pour la table `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`IdPartImplemented`) REFERENCES `partimplemented` (`IdPartImplemented`);

--
-- Contraintes pour la table `user`
--
ALTER TABLE `user`
  ADD CONSTRAINT `user_ibfk_1` FOREIGN KEY (`IdPlant`) REFERENCES `plant` (`IdPlant`);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
