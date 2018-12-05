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
  `IdUser` int(255) NOT NULL,
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
  KEY `IdUser` (`IdUser`),
  CONSTRAINT `part_offer_ibfk_1` FOREIGN KEY (`IdPartImplemented`) REFERENCES `partimplemented` (`IdPartImplemented`),
  CONSTRAINT `part_offer_ibfk_2` FOREIGN KEY (`IdUser`) REFERENCES `user` (`IdUser`)
) ENGINE=InnoDB AUTO_INCREMENT=55 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `part_offer`
--

LOCK TABLES `part_offer` WRITE;
/*!40000 ALTER TABLE `part_offer` DISABLE KEYS */;
INSERT INTO `part_offer` VALUES (30,2,1,'2018-11-30',NULL,3,4,0,'30_PlantTest_MyPart2_Somewhere_Offer.pdf','30_PlantTest_MyPart2_Somewhere_OrderFromClient.pdf',NULL),(31,3,1,'2018-11-30',NULL,2,4,0,'31_PlantTest_NotAPart_Nowhere_Offer.pdf','31_PlantTest_NotAPart_Nowhere_OrderFromClient.pdf',NULL),(32,3,1,'2018-11-30',NULL,4,4,0,'32_PlantTest_NotAPart_Nowhere_Offer.pdf','32_PlantTest_NotAPart_Nowhere_OrderFromClient.pdf',NULL),(33,1,1,'2018-11-30',NULL,4,6,0,NULL,NULL,NULL),(34,1,1,'2018-11-30',NULL,3,4,0,'34_PlantTest_MyPart_ABCD1_OrderFromERC.pdf','34_PlantTest_MyPart_ABCD1_OrderFromClient.pdf',NULL),(35,2,1,'2018-11-30',NULL,4,4,0,'35_PlantTest_MyPart2_Somewhere_OrderFromERC.pdf','35_PlantTest_MyPart2_Somewhere_OrderFromClient.pdf',NULL),(36,1,1,'2018-11-30',NULL,2,4,0,'36_PlantTest_MyPart_ABCD1_OrderFromERC.pdf','36_PlantTest_MyPart_ABCD1_OrderFromClient.pdf','36_PlantTest_MyPart_ABCD1_OrderFromERC.pdf'),(37,1,1,'2018-11-30',NULL,2,4,0,'37_PlantTest_MyPart_ABCD1_OrderFromERC.pdf','37_PlantTest_MyPart_ABCD1_OrderFromClient.docx','37_PlantTest_MyPart_ABCD1_OrderFromERC.png'),(38,1,1,'2018-12-04',NULL,3,6,0,NULL,NULL,NULL),(40,1,7,'2018-12-04',NULL,4,6,0,NULL,NULL,NULL),(41,2,7,'2018-12-04',NULL,2,6,0,NULL,NULL,NULL),(42,2,6,'2018-12-05',NULL,2,6,0,NULL,NULL,NULL),(43,3,6,'2018-12-05',NULL,3,6,0,NULL,NULL,NULL),(44,2,6,'2018-12-05',NULL,2,6,0,NULL,NULL,NULL),(45,2,6,'2018-12-05',NULL,2,6,0,NULL,NULL,NULL),(46,2,6,'2018-12-05',NULL,2,6,0,NULL,NULL,NULL),(47,3,6,'2018-12-05',NULL,2,6,0,NULL,NULL,NULL),(48,2,6,'2018-12-05',NULL,2,3,0,NULL,'48_PlantTest_MyPart2_Somewhere_OrderFromERC.pdf',NULL),(49,1,6,'2018-12-05',NULL,2,3,0,NULL,'49_PlantTest_MyPart_ABCD1_OrderFromERC.pdf',NULL),(50,2,6,'2018-12-05',NULL,2,3,0,NULL,'50_PlantTest_MyPart2_Somewhere_OfferFromERC.pdf',NULL),(51,2,6,'2018-12-05',NULL,2,3,0,NULL,'51_PlantTest_MyPart2_Somewhere_OfferFromERC.pdf',NULL),(52,1,6,'2018-12-05',NULL,2,6,0,'52_PlantTest_MyPart_ABCD1_OfferFromERC.pdf',NULL,NULL),(53,2,6,'2018-12-05',NULL,2,6,0,'53_PlantTest_MyPart2_Somewhere_OfferFromERC.pdf',NULL,NULL),(54,2,6,'2018-12-05',NULL,2,2,0,'54_PlantTest_MyPart2_Somewhere_OfferFromERC.pdf',NULL,NULL);
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
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `partimplemented`
--

LOCK TABLES `partimplemented` WRITE;
/*!40000 ALTER TABLE `partimplemented` DISABLE KEYS */;
INSERT INTO `partimplemented` VALUES (1,1,1,1,'ABCD1'),(2,1,2,1,'Somewhere'),(3,1,3,1,'Nowhere');
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `plant`
--

LOCK TABLES `plant` WRITE;
/*!40000 ALTER TABLE `plant` DISABLE KEYS */;
INSERT INTO `plant` VALUES (1,'PlantTest','PlantTest@ProEmail.de',100,'Somewhere in Deutschland');
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
  `IdReductionAgent` int(255) NOT NULL,
  `OfferDateStart` date DEFAULT NULL,
  `QuantityInL` int(255) NOT NULL,
  `Price` int(255) NOT NULL,
  `UserSeen` tinyint(1) NOT NULL,
  `OrderFromClient` text COLLATE utf8_bin NOT NULL,
  `OrderFromERC` text COLLATE utf8_bin NOT NULL,
  `OfferState` int(255) DEFAULT NULL,
  `IdUser` int(255) NOT NULL,
  PRIMARY KEY (`IdRA_Offer`),
  KEY `IdReductionAgent` (`IdReductionAgent`),
  KEY `IdUser` (`IdUser`),
  CONSTRAINT `ra_offer_ibfk_1` FOREIGN KEY (`IdReductionAgent`) REFERENCES `reductionagent` (`IdReductionAgent`),
  CONSTRAINT `ra_offer_ibfk_2` FOREIGN KEY (`IdUser`) REFERENCES `user` (`IdUser`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `ra_offer`
--

LOCK TABLES `ra_offer` WRITE;
/*!40000 ALTER TABLE `ra_offer` DISABLE KEYS */;
INSERT INTO `ra_offer` VALUES (1,1,'2018-11-29',50,750,0,'','',NULL,1),(2,1,'2018-11-29',50,750,0,'','',1,1);
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
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reductionagent`
--

LOCK TABLES `reductionagent` WRITE;
/*!40000 ALTER TABLE `reductionagent` DISABLE KEYS */;
INSERT INTO `reductionagent` VALUES (1,'1',1,15,45,100,0);
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
  `IdPartImplemented` int(255) NOT NULL,
  `ReviewDate` date NOT NULL,
  `ReviewType` int(255) NOT NULL,
  `IdUser` int(255) NOT NULL,
  PRIMARY KEY (`IdReview`),
  KEY `IdPartImplemented` (`IdPartImplemented`),
  KEY `IdUser` (`IdUser`),
  CONSTRAINT `review_ibfk_1` FOREIGN KEY (`IdPartImplemented`) REFERENCES `partimplemented` (`IdPartImplemented`),
  CONSTRAINT `review_ibfk_2` FOREIGN KEY (`IdUser`) REFERENCES `user` (`IdUser`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `review`
--

LOCK TABLES `review` WRITE;
/*!40000 ALTER TABLE `review` DISABLE KEYS */;
INSERT INTO `review` VALUES (4,2,'2018-01-01',2,1),(5,2,'2018-02-02',2,1),(6,2,'2018-02-09',4,1),(7,2,'2018-11-06',1,1),(8,2,'2018-11-23',1,1),(9,2,'2018-11-23',1,1),(10,2,'2018-11-08',1,1),(11,1,'2018-09-04',3,1),(12,1,'2018-08-04',4,1),(13,1,'2018-12-02',3,1);
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
  `isConnected` tinyint(1) NOT NULL,
  PRIMARY KEY (`IdUser`),
  UNIQUE KEY `Login` (`Login`),
  KEY `IdPlant` (`IdPlant`)
) ENGINE=InnoDB AUTO_INCREMENT=15 DEFAULT CHARSET=utf8 COLLATE=utf8_bin;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `user`
--

LOCK TABLES `user` WRITE;
/*!40000 ALTER TABLE `user` DISABLE KEYS */;
INSERT INTO `user` VALUES (1,1,'Bremondt','1234','bremond.thomas@gmail.com',1,0),(3,NULL,'BDran','1234','Dran@gmail.com',2,0),(5,NULL,'KataA','1234','Kata@gmail.com',3,0),(6,NULL,'PatS','1234','Patricia@gmail.com',4,0),(7,1,'operator','1234','test@gmail.com',3,0),(14,1,'oui','Yuep2','oui@gmail.com',3,0);
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

-- Dump completed on 2018-12-05 11:35:30
