-- phpMyAdmin SQL Dump
-- version 4.8.4
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 16. Jan 2019 um 16:10
-- Server-Version: 10.1.37-MariaDB
-- PHP-Version: 7.3.0

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `erc`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `part`
--

CREATE TABLE `part` (
  `IdPart` int(255) NOT NULL,
  `IdSupplier` int(255) NOT NULL,
  `KKS` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `PartName` text COLLATE utf8_bin NOT NULL,
  `PartDescription` text COLLATE utf8_bin NOT NULL,
  `PressureNominal` int(11) DEFAULT NULL,
  `DiameterNominal` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `part`
--

INSERT INTO `part` (`IdPart`, `IdSupplier`, `KKS`, `PartName`, `PartDescription`, `PressureNominal`, `DiameterNominal`) VALUES
(1, 1, NULL, 'MyPart', 'MyPart\'s cool description', NULL, NULL),
(2, 1, NULL, 'MyPart_2', '2nd Best part in the neighborho', NULL, NULL),
(3, 1, NULL, 'NotAPart', 'What were you expecting?', NULL, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `partimplemented`
--

CREATE TABLE `partimplemented` (
  `IdPartImplemented` int(255) NOT NULL,
  `IdPlant` int(255) NOT NULL,
  `IdPart` int(255) NOT NULL,
  `isImplemented` tinyint(1) NOT NULL,
  `Location` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `partimplemented`
--

INSERT INTO `partimplemented` (`IdPartImplemented`, `IdPlant`, `IdPart`, `isImplemented`, `Location`) VALUES
(1, 1, 1, 1, 'ABCD1'),
(2, 1, 2, 0, 'Somewhere'),
(3, 1, 3, 1, 'Nowhere'),
(4, 1, 2, 1, 'cool_location'),
(5, 1, 1, 1, 'neighborhood'),
(6, 1, 3, 1, 'a+'),
(10, 1, 1, 1, ''),
(11, 1, 2, 1, ''),
(12, 1, 3, 1, '');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `part_offer`
--

CREATE TABLE `part_offer` (
  `IdPart_Offer` int(255) NOT NULL,
  `IdPartImplemented` int(255) NOT NULL,
  `CreatorLogin` varchar(20) COLLATE utf8_bin NOT NULL,
  `OfferDateStart` date NOT NULL,
  `Price` int(255) DEFAULT NULL,
  `OfferType` int(255) NOT NULL,
  `OfferState` int(255) NOT NULL,
  `UserSeen` tinyint(1) NOT NULL,
  `Offer` text COLLATE utf8_bin,
  `OrderFromClient` text COLLATE utf8_bin,
  `OrderFromERC` text COLLATE utf8_bin
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `part_offer`
--

INSERT INTO `part_offer` (`IdPart_Offer`, `IdPartImplemented`, `CreatorLogin`, `OfferDateStart`, `Price`, `OfferType`, `OfferState`, `UserSeen`, `Offer`, `OrderFromClient`, `OrderFromERC`) VALUES
(65, 4, 'operator', '2018-12-12', NULL, 4, 4, 0, '65_PlantTest_MyPart2_cool_location_OfferFromERC.pdf', '65_PlantTest_MyPart2_cool_location_OrderFromClient.pdf', '65_PlantTest_MyPart2_cool_location_OrderFromERC.pdf');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `plant`
--

CREATE TABLE `plant` (
  `IdPlant` int(255) NOT NULL,
  `PlantName` text COLLATE utf8_bin NOT NULL,
  `PlantEmail` text COLLATE utf8_bin NOT NULL,
  `TypicalDeliveryTime` int(255) NOT NULL,
  `Address` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `plant`
--

INSERT INTO `plant` (`IdPlant`, `PlantName`, `PlantEmail`, `TypicalDeliveryTime`, `Address`) VALUES
(1, 'PlantTest', 'PlantTest@ProEmail.de', 100, 'Somewhere in Deutschland'),
(2, 'PlantTest2', 'PlantTest@EvenMoreProEmail.dk', 87, 'Somewhere in Denmark');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `ra_offer`
--

CREATE TABLE `ra_offer` (
  `IdRA_Offer` int(255) NOT NULL,
  `CreatorLogin` varchar(20) COLLATE utf8_bin NOT NULL,
  `IdPlant` int(255) NOT NULL,
  `OfferDateStart` date DEFAULT NULL,
  `QuantityInL` int(255) NOT NULL,
  `Price` int(255) NOT NULL,
  `UserSeen` tinyint(1) NOT NULL,
  `OrderFromClient` text COLLATE utf8_bin NOT NULL,
  `OrderFromERC` text COLLATE utf8_bin NOT NULL,
  `OfferState` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `ra_offer`
--

INSERT INTO `ra_offer` (`IdRA_Offer`, `CreatorLogin`, `IdPlant`, `OfferDateStart`, `QuantityInL`, `Price`, `UserSeen`, `OrderFromClient`, `OrderFromERC`, `OfferState`) VALUES
(14, 'operator', 1, '2018-12-12', 95, 1625, 0, '14_PlantTest_2018-12-12_OrderFromClient.pdf', '14_PlantTest_2018-12-12_OrderFromERC.pdf', 4);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `reductionagent`
--

CREATE TABLE `reductionagent` (
  `IdReductionAgent` int(255) NOT NULL,
  `TankName` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `IdPlant` int(255) NOT NULL,
  `PricePerL` float NOT NULL,
  `LevelofRAInL` int(255) NOT NULL,
  `TotalCapacityInL` float NOT NULL,
  `AverageConsumption` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `reductionagent`
--

INSERT INTO `reductionagent` (`IdReductionAgent`, `TankName`, `IdPlant`, `PricePerL`, `LevelofRAInL`, `TotalCapacityInL`, `AverageConsumption`) VALUES
(1, '1', 1, 15, 45, 100, 0),
(3, '2', 1, 20, 80, 120, NULL),
(4, '4', 2, 15, 75, 95, NULL);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `review`
--

CREATE TABLE `review` (
  `IdReview` int(255) NOT NULL,
  `CreatorLogin` varchar(20) COLLATE utf8_bin NOT NULL,
  `IdPartImplemented` int(255) NOT NULL,
  `ReviewDate` date NOT NULL,
  `ReviewType` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `review`
--

INSERT INTO `review` (`IdReview`, `CreatorLogin`, `IdPartImplemented`, `ReviewDate`, `ReviewType`) VALUES
(47, 'maint', 6, '2018-12-12', 3);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `supplier`
--

CREATE TABLE `supplier` (
  `IdSupplier` int(255) NOT NULL,
  `SupplierName` text COLLATE utf8_bin NOT NULL,
  `SupplierEmail` text COLLATE utf8_bin NOT NULL,
  `Number` text COLLATE utf8_bin NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `supplier`
--

INSERT INTO `supplier` (`IdSupplier`, `SupplierName`, `SupplierEmail`, `Number`) VALUES
(1, 'ERC', 'ERC@ProEmail.de', '+999999999');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `user`
--

CREATE TABLE `user` (
  `IdUser` int(255) NOT NULL,
  `IdPlant` int(255) DEFAULT NULL,
  `Login` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `Password` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `Email` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `UserRole` int(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

--
-- Daten für Tabelle `user`
--

INSERT INTO `user` (`IdUser`, `IdPlant`, `Login`, `Password`, `Email`, `UserRole`) VALUES
(18, 1, 'operator', '1234', 'operator@erc.com', 3),
(19, NULL, 'maintenance', '1234', 'maintenance@erc.de', 6),
(20, 1, 'PlantAdmin', '1234', 'plantadmin@erc.de', 1),
(21, NULL, 'ErcAdmim', '1234', 'ercadmin@erc.de', 2),
(22, NULL, 'ErcService', '1234', 'ercservice@erc.de', 4),
(23, NULL, 'ErcAdditive', '1234', 'ercadditive@erc.de', 5);

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `part`
--
ALTER TABLE `part`
  ADD PRIMARY KEY (`IdPart`),
  ADD KEY `IDSupplier` (`IdSupplier`);

--
-- Indizes für die Tabelle `partimplemented`
--
ALTER TABLE `partimplemented`
  ADD PRIMARY KEY (`IdPartImplemented`),
  ADD KEY `IdPlant` (`IdPlant`),
  ADD KEY `IdPart` (`IdPart`),
  ADD KEY `IdPart_2` (`IdPart`),
  ADD KEY `IdPlant_2` (`IdPlant`);

--
-- Indizes für die Tabelle `part_offer`
--
ALTER TABLE `part_offer`
  ADD PRIMARY KEY (`IdPart_Offer`),
  ADD KEY `IdPartImplemented` (`IdPartImplemented`);

--
-- Indizes für die Tabelle `plant`
--
ALTER TABLE `plant`
  ADD PRIMARY KEY (`IdPlant`);

--
-- Indizes für die Tabelle `ra_offer`
--
ALTER TABLE `ra_offer`
  ADD PRIMARY KEY (`IdRA_Offer`),
  ADD KEY `IdReductionAgent` (`IdPlant`);

--
-- Indizes für die Tabelle `reductionagent`
--
ALTER TABLE `reductionagent`
  ADD PRIMARY KEY (`IdReductionAgent`),
  ADD KEY `IdPlant` (`IdPlant`);

--
-- Indizes für die Tabelle `review`
--
ALTER TABLE `review`
  ADD PRIMARY KEY (`IdReview`),
  ADD KEY `IdPartImplemented` (`IdPartImplemented`);

--
-- Indizes für die Tabelle `supplier`
--
ALTER TABLE `supplier`
  ADD PRIMARY KEY (`IdSupplier`);

--
-- Indizes für die Tabelle `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`IdUser`),
  ADD UNIQUE KEY `Login` (`Login`),
  ADD KEY `IdPlant` (`IdPlant`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `part`
--
ALTER TABLE `part`
  MODIFY `IdPart` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `partimplemented`
--
ALTER TABLE `partimplemented`
  MODIFY `IdPartImplemented` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT für Tabelle `part_offer`
--
ALTER TABLE `part_offer`
  MODIFY `IdPart_Offer` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=66;

--
-- AUTO_INCREMENT für Tabelle `plant`
--
ALTER TABLE `plant`
  MODIFY `IdPlant` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT für Tabelle `ra_offer`
--
ALTER TABLE `ra_offer`
  MODIFY `IdRA_Offer` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15;

--
-- AUTO_INCREMENT für Tabelle `reductionagent`
--
ALTER TABLE `reductionagent`
  MODIFY `IdReductionAgent` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `review`
--
ALTER TABLE `review`
  MODIFY `IdReview` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=48;

--
-- AUTO_INCREMENT für Tabelle `supplier`
--
ALTER TABLE `supplier`
  MODIFY `IdSupplier` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT für Tabelle `user`
--
ALTER TABLE `user`
  MODIFY `IdUser` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=24;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `part`
--
ALTER TABLE `part`
  ADD CONSTRAINT `part_ibfk_1` FOREIGN KEY (`IdSupplier`) REFERENCES `supplier` (`IdSupplier`);

--
-- Constraints der Tabelle `partimplemented`
--
ALTER TABLE `partimplemented`
  ADD CONSTRAINT `partimplemented_ibfk_1` FOREIGN KEY (`IdPlant`) REFERENCES `plant` (`IdPlant`),
  ADD CONSTRAINT `partimplemented_ibfk_2` FOREIGN KEY (`IdPart`) REFERENCES `part` (`IdPart`);

--
-- Constraints der Tabelle `part_offer`
--
ALTER TABLE `part_offer`
  ADD CONSTRAINT `part_offer_ibfk_1` FOREIGN KEY (`IdPartImplemented`) REFERENCES `partimplemented` (`IdPartImplemented`);

--
-- Constraints der Tabelle `ra_offer`
--
ALTER TABLE `ra_offer`
  ADD CONSTRAINT `ra_offer_ibfk_1` FOREIGN KEY (`IdPlant`) REFERENCES `plant` (`IdPlant`);

--
-- Constraints der Tabelle `reductionagent`
--
ALTER TABLE `reductionagent`
  ADD CONSTRAINT `reductionagent_ibfk_1` FOREIGN KEY (`IdPlant`) REFERENCES `plant` (`IdPlant`);

--
-- Constraints der Tabelle `review`
--
ALTER TABLE `review`
  ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`IdPartImplemented`) REFERENCES `partimplemented` (`IdPartImplemented`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
