CREATE DATABASE  IF NOT EXISTS `hotelventura` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `hotelventura`;
-- MySQL dump 10.13  Distrib 8.0.28, for Win64 (x86_64)
--
-- Host: localhost    Database: hotelventura
-- ------------------------------------------------------
-- Server version	8.0.28

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `tb_contatos`
--

DROP TABLE IF EXISTS `tb_contatos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_contatos` (
  `id_contato` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `mensagem` text NOT NULL,
  `data_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_contato`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_contatos`
--

LOCK TABLES `tb_contatos` WRITE;
/*!40000 ALTER TABLE `tb_contatos` DISABLE KEYS */;
INSERT INTO `tb_contatos` VALUES (3,'Teste','teste@teste.com','teste23134','2022-06-08 23:42:56');
/*!40000 ALTER TABLE `tb_contatos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_emails`
--

DROP TABLE IF EXISTS `tb_emails`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_emails` (
  `id_email` int NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id_email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_emails`
--

LOCK TABLES `tb_emails` WRITE;
/*!40000 ALTER TABLE `tb_emails` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_emails` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_log_reservas`
--

DROP TABLE IF EXISTS `tb_log_reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_log_reservas` (
  `id_log_reserva` int NOT NULL,
  `texto_log` varchar(200) NOT NULL,
  `data_registro` timestamp NULL DEFAULT NULL,
  PRIMARY KEY (`id_log_reserva`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_log_reservas`
--

LOCK TABLES `tb_log_reservas` WRITE;
/*!40000 ALTER TABLE `tb_log_reservas` DISABLE KEYS */;
/*!40000 ALTER TABLE `tb_log_reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_quartos`
--

DROP TABLE IF EXISTS `tb_quartos`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_quartos` (
  `id_quarto` int NOT NULL AUTO_INCREMENT,
  `nome_quarto` varchar(128) NOT NULL,
  `descricao` varchar(512) NOT NULL,
  `tarifa` decimal(10,2) NOT NULL,
  `foto` varchar(256) NOT NULL,
  `data_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id_quarto`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_quartos`
--

LOCK TABLES `tb_quartos` WRITE;
/*!40000 ALTER TABLE `tb_quartos` DISABLE KEYS */;
INSERT INTO `tb_quartos` VALUES (1,'Bife de Costela com molho','Vide electram sadipscing et per. Aenean aliquam molestie leo, vitae iaculis nisl.',40.00,'images/1ce85fd1cb1deebf5b9454a01.jpg','2018-09-12 16:48:58'),(2,'Hambúrguer com Fritas','Vide electram sadipscing et per. Aenean aliquam leo, vitae iaculis nisl.',40.00,'images/b96aebc26eff9b487b674b104.jpg','2018-09-12 16:48:58'),(10,'Teste21234412','TEste2234',120.00,'images/b96aebc26eff9b487b674b105.jpg','2022-06-20 20:52:44'),(12,'Quarto presidencial','quarto presidencial',500.00,'images/a846c5291e5d8e1a84b4e6e01.jpg','2022-06-21 18:11:29');
/*!40000 ALTER TABLE `tb_quartos` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_reservas`
--

DROP TABLE IF EXISTS `tb_reservas`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_reservas` (
  `id_reserva` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `qt_hospedes` int NOT NULL,
  `data_inicio` date NOT NULL,
  `data_fim` date NOT NULL,
  `data_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `fk_id_quarto` int DEFAULT NULL,
  PRIMARY KEY (`id_reserva`),
  KEY `fk_id_quartos_idx` (`fk_id_quarto`),
  CONSTRAINT `fk_id_quartos` FOREIGN KEY (`fk_id_quarto`) REFERENCES `tb_quartos` (`id_quarto`)
) ENGINE=InnoDB AUTO_INCREMENT=513 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_reservas`
--

LOCK TABLES `tb_reservas` WRITE;
/*!40000 ALTER TABLE `tb_reservas` DISABLE KEYS */;
INSERT INTO `tb_reservas` VALUES (511,'Teste','teste@teste.com.br',4,'2022-07-07','2022-07-21','2022-07-06 22:37:43',NULL),(512,'Teste','teste@teste.com.br',2,'2022-07-08','2022-07-21','2022-07-06 22:42:43',NULL);
/*!40000 ALTER TABLE `tb_reservas` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `tb_usuarios`
--

DROP TABLE IF EXISTS `tb_usuarios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `tb_usuarios` (
  `id_usuario` int NOT NULL AUTO_INCREMENT,
  `nome` varchar(256) NOT NULL,
  `email` varchar(256) NOT NULL,
  `senha` varchar(256) NOT NULL,
  `data_registro` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `tipo_usuario` int NOT NULL,
  PRIMARY KEY (`id_usuario`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb3;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `tb_usuarios`
--

LOCK TABLES `tb_usuarios` WRITE;
/*!40000 ALTER TABLE `tb_usuarios` DISABLE KEYS */;
INSERT INTO `tb_usuarios` VALUES (1,'João Rangel','joao@hcode.com.br','1111','2018-04-17 18:57:44',1),(4,'Antonio Souza','antvinicius@gmail.com','3333','2022-06-08 22:51:10',1),(5,'admin','admin@admin.com','1234','2022-07-13 13:55:04',1);
/*!40000 ALTER TABLE `tb_usuarios` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2022-07-13 11:40:27