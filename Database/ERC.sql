-- MySQL dump 10.16  Distrib 10.1.37-MariaDB, for debian-linux-gnueabihf (armv8l)
--
-- Host: localhost    Database: ERC
-- ------------------------------------------------------
-- Server version	10.1.37-MariaDB-0+deb9u1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `part`
--

DROP TABLE IF EXISTS `part`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `part` (
  `IdPart` int(255) NOT NULL AUTO_INCREMENT,
  `IdSupplier` int(255) NOT NULL,
  `PartName` text COLLATE utf8_bin NOT NULL,
  `PartDescription` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`IdPart`),
  KEY `IDSupplier` (`IdSupplier`),
  CONSTRAINT `part_ibfk_1` FOREIGN KEY (`IdSupplier`) REFERENCES `supplier` (`IdSupplier`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `part`
--

LOCK TABLES `part` WRITE;
/*!40000 ALTER TABLE `part` DISABLE KEYS */;
INSERT INTO `part` VALUES (1,1,'MyPart','MyPart\'s cool description'),(2,1,'MyPart2','2nd Best part in the neighborhood'),(3,1,'NotAPart','What were you expecting?');
/*!40000 ALTER TABLE `part` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `part_offer`
--

DROP TABLE IF EXISTS `part_offer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `part_offer` (
  `IdPart_Offer` int(255) NOT NULL AUTO_INCREMENT,
  `IdPartImplemented` int(255) NOT NULL,
  `CreatorLogin` varchar(20) COLLATE utf8_bin NOT NULL,
  `OfferDateStart` date NOT NULL,
  `Price` int(255) DEFAULT NULL,
  `OfferType` int(255) NOT NULL,
  `OfferState` int(255) NOT NULL,
  `UserSeen` tinyint(1) NOT NULL,
  `Offer` text COLLATE utf8_bin,
  `OrderFromClient` text COLLATE utf8_bin,
  `OrderFromERC` text COLLATE utf8_bin,
  PRIMARY KEY (`IdPart_Offer`),
  KEY `IdPartImplemented` (`IdPartImplemented`),
  CONSTRAINT `part_offer_ibfk_1` FOREIGN KEY (`IdPartImplemented`) REFERENCES `partimplemented` (`IdPartImplemented`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `part_offer`
--

LOCK TABLES `part_offer` WRITE;
/*!40000 ALTER TABLE `part_offer` DISABLE KEYS */;
INSERT INTO `part_offer` VALUES (65,4,'operator','2018-12-12',NULL,4,4,0,'65_PlantTest_MyPart2_cool_location_OfferFromERC.pdf','65_PlantTest_MyPart2_cool_location_OrderFromClient.pdf','65_PlantTest_MyPart2_cool_location_OrderFromERC.pdf');
/*!40000 ALTER TABLE `part_offer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `partimplemented`
--

DROP TABLE IF EXISTS `partimplemented`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `partimplemented` (
  `IdPartImplemented` int(255) NOT NULL AUTO_INCREMENT,
  `IdPlant` int(255) NOT NULL,
  `IdPart` int(255) NOT NULL,
  `isImplemented` tinyint(1) NOT NULL,
  `Location` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`IdPartImplemented`),
  KEY `IdPlant` (`IdPlant`),
  KEY `IdPart` (`IdPart`),
  KEY `IdPart_2` (`IdPart`),
  KEY `IdPlant_2` (`IdPlant`),
  CONSTRAINT `partimplemented_ibfk_1` FOREIGN KEY (`IdPlant`) REFERENCES `plant` (`IdPlant`),
  CONSTRAINT `partimplemented_ibfk_2` FOREIGN KEY (`IdPart`) REFERENCES `part` (`IdPart`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partimplemented`
--

LOCK TABLES `partimplemented` WRITE;
/*!40000 ALTER TABLE `partimplemented` DISABLE KEYS */;
INSERT INTO `partimplemented` VALUES (1,1,1,1,'ABCD1'),(2,1,2,0,'Somewhere'),(3,1,3,1,'Nowhere'),(4,1,2,1,'cool_location'),(5,1,1,1,'neighborhood'),(6,1,3,1,'a+');
/*!40000 ALTER TABLE `partimplemented` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `plant`
--

DROP TABLE IF EXISTS `plant`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `plant` (
  `IdPlant` int(255) NOT NULL AUTO_INCREMENT,
  `PlantName` text COLLATE utf8_bin NOT NULL,
  `PlantEmail` text COLLATE utf8_bin NOT NULL,
  `TypicalDeliveryTime` int(255) NOT NULL,
  `Address` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`IdPlant`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plant`
--

LOCK TABLES `plant` WRITE;
/*!40000 ALTER TABLE `plant` DISABLE KEYS */;
INSERT INTO `plant` VALUES (1,'PlantTest','PlantTest@ProEmail.de',100,'Somewhere in Deutschland'),(2,'PlantTest2','PlantTest@EvenMoreProEmail.dk',87,'Somewhere in Denmark');
/*!40000 ALTER TABLE `plant` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `ra_offer`
--

DROP TABLE IF EXISTS `ra_offer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `ra_offer` (
  `IdRA_Offer` int(255) NOT NULL AUTO_INCREMENT,
  `CreatorLogin` varchar(20) COLLATE utf8_bin NOT NULL,
  `IdPlant` int(255) NOT NULL,
  `OfferDateStart` date DEFAULT NULL,
  `QuantityInL` int(255) NOT NULL,
  `Price` int(255) NOT NULL,
  `UserSeen` tinyint(1) NOT NULL,
  `OrderFromClient` text COLLATE utf8_bin NOT NULL,
  `OrderFromERC` text COLLATE utf8_bin NOT NULL,
  `OfferState` int(255) DEFAULT NULL,
  PRIMARY KEY (`IdRA_Offer`),
  KEY `IdReductionAgent` (`IdPlant`),
  CONSTRAINT `ra_offer_ibfk_1` FOREIGN KEY (`IdPlant`) REFERENCES `plant` (`IdPlant`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ra_offer`
--

LOCK TABLES `ra_offer` WRITE;
/*!40000 ALTER TABLE `ra_offer` DISABLE KEYS */;
INSERT INTO `ra_offer` VALUES (14,'operator',1,'2018-12-12',95,1625,0,'14_PlantTest_2018-12-12_OrderFromClient.pdf','14_PlantTest_2018-12-12_OrderFromERC.pdf',4);
/*!40000 ALTER TABLE `ra_offer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reductionagent`
--

DROP TABLE IF EXISTS `reductionagent`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `reductionagent` (
  `IdReductionAgent` int(255) NOT NULL AUTO_INCREMENT,
  `TankName` varchar(255) COLLATE utf8_bin DEFAULT NULL,
  `IdPlant` int(255) NOT NULL,
  `PricePerL` float NOT NULL,
  `LevelofRAInL` int(255) NOT NULL,
  `TotalCapacityInL` float NOT NULL,
  `AverageConsumption` int(255) DEFAULT NULL,
  PRIMARY KEY (`IdReductionAgent`),
  KEY `IdPlant` (`IdPlant`),
  CONSTRAINT `reductionagent_ibfk_1` FOREIGN KEY (`IdPlant`) REFERENCES `plant` (`IdPlant`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reductionagent`
--

LOCK TABLES `reductionagent` WRITE;
/*!40000 ALTER TABLE `reductionagent` DISABLE KEYS */;
INSERT INTO `reductionagent` VALUES (1,'1',1,15,45,100,0),(3,'2',1,20,80,120,NULL),(4,'4',2,15,75,95,NULL);
/*!40000 ALTER TABLE `reductionagent` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `review`
--

DROP TABLE IF EXISTS `review`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `review` (
  `IdReview` int(255) NOT NULL AUTO_INCREMENT,
  `CreatorLogin` varchar(20) COLLATE utf8_bin NOT NULL,
  `IdPartImplemented` int(255) NOT NULL,
  `ReviewDate` date NOT NULL,
  `ReviewType` int(255) NOT NULL,
  PRIMARY KEY (`IdReview`),
  KEY `IdPartImplemented` (`IdPartImplemented`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`IdPartImplemented`) REFERENCES `partimplemented` (`IdPartImplemented`)
) ENGINE=InnoDB AUTO_INCREMENT=48 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (47,'maint',6,'2018-12-12',3);
/*!40000 ALTER TABLE `review` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `supplier`
--

DROP TABLE IF EXISTS `supplier`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `supplier` (
  `IdSupplier` int(255) NOT NULL AUTO_INCREMENT,
  `SupplierName` text COLLATE utf8_bin NOT NULL,
  `SupplierEmail` text COLLATE utf8_bin NOT NULL,
  `Number` text COLLATE utf8_bin NOT NULL,
  PRIMARY KEY (`IdSupplier`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `supplier`
--

LOCK TABLES `supplier` WRITE;
/*!40000 ALTER TABLE `supplier` DISABLE KEYS */;
INSERT INTO `supplier` VALUES (1,'ERC','ERC@ProEmail.de','+999999999');
/*!40000 ALTER TABLE `supplier` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `user`
--

DROP TABLE IF EXISTS `user`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `user` (
  `IdUser` int(255) NOT NULL AUTO_INCREMENT,
  `IdPlant` int(255) DEFAULT NULL,
  `Login` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `Password` varchar(20) COLLATE utf8_bin DEFAULT NULL,
  `Email` varchar(100) COLLATE utf8_bin DEFAULT NULL,
  `UserRole` int(255) DEFAULT NULL,
  PRIMARY KEY (`IdUser`),
  UNIQUE KEY `Login` (`Login`),
  KEY `IdPlant` (`IdPlant`)
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,1,'Bremondt','1234','bremond.thomas@gmail.com',1),(3,NULL,'BDran','1234','Dran@gmail.com',2),(5,NULL,'KataA','1234','Kata@gmail.com',3),(6,NULL,'PatS','1234','Patricia@gmail.com',4),(7,1,'operator','1234','test@gmail.com',3),(14,1,'oui','Yuep2','oui@gmail.com',3),(15,NULL,'add','1234','add@gmail.com',5),(16,NULL,'maint','1234','maint@gmail.com',6);
/*!40000 ALTER TABLE `user` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2018-12-12 10:33:37
