/*M!999999\- enable the sandbox mode */ 
-- MariaDB dump 10.19  Distrib 10.6.22-MariaDB, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: kantinho_db
-- ------------------------------------------------------
-- Server version	10.6.22-MariaDB-0ubuntu0.22.04.1

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
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES ('BEBIDAS','BEBIDAS'),('PIZZAS','PIZZAS');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `delivery_zones`
--

DROP TABLE IF EXISTS `delivery_zones`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `delivery_zones` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `price` decimal(10,2) NOT NULL,
  `estimated_time` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `delivery_zones`
--

LOCK TABLES `delivery_zones` WRITE;
/*!40000 ALTER TABLE `delivery_zones` DISABLE KEYS */;
INSERT INTO `delivery_zones` VALUES ('z1','Terra Branca',50.00,'15-25 min'),('z10','Bairro Craveiro Lopes',200.00,'25-35 min'),('z11','Cidadela',200.00,'25-35 min'),('z12','Fazenda',200.00,'25-35 min'),('z13','Quebra Canela',200.00,'25-35 min'),('z14','Monte Vermelho',200.00,'25-35 min'),('z15','Palmarejo Grande',200.00,'25-35 min'),('z16','Praia Negra',200.00,'25-35 min'),('z17','Plateau',200.00,'25-35 min'),('z18','Prainha',200.00,'25-35 min'),('z19','Achadinha Pires',250.00,'30-40 min'),('z2','Tira Chapéu',100.00,'15-25 min'),('z20','Campus Unicv',250.00,'30-40 min'),('z21','Cova Minhoto',250.00,'30-40 min'),('z22','Calabaceira',250.00,'30-40 min'),('z23','Coqueiro',250.00,'30-40 min'),('z24','Castelão',250.00,'30-40 min'),('z25','Lém Ferreira',200.00,'25-35 min'),('z26','Ponta Água',250.00,'30-40 min'),('z27','Pensamento',250.00,'30-40 min'),('z28','Palmarejo',250.00,'30-40 min'),('z29','Safende',250.00,'30-40 min'),('z3','Bela Vista',150.00,'20-30 min'),('z30','Vila Nova',250.00,'30-40 min'),('z31','Achada São Filipe',300.00,'35-45 min'),('z32','Achada Grande Frente',300.00,'35-45 min'),('z33','Achada Grande Trás',300.00,'35-45 min'),('z34','Achada Eugênio Lima',300.00,'35-45 min'),('z35','Achada Mato',300.00,'35-45 min'),('z36','São Pedro Latada',300.00,'35-45 min'),('z4','Zona Quelém',150.00,'20-30 min'),('z5','Fundo Cobom',150.00,'20-30 min'),('z6','Várzea',150.00,'20-30 min'),('z7','Achadinha',200.00,'25-35 min'),('z8','Alto Glória',200.00,'25-35 min'),('z9','Achada Santo António',200.00,'25-35 min');
/*!40000 ALTER TABLE `delivery_zones` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orders`
--

DROP TABLE IF EXISTS `orders`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `orders` (
  `id` varchar(50) NOT NULL,
  `user_phone` varchar(20) DEFAULT NULL,
  `customer_name` varchar(100) NOT NULL,
  `zone_name` varchar(100) DEFAULT NULL,
  `total` decimal(10,2) NOT NULL,
  `status` enum('RECEBIDO','PREPARO','PRONTO','ENTREGUE','CONCLUIDO','CANCELADO') DEFAULT 'RECEBIDO',
  `payment_method` enum('DINHEIRO','CARTAO','USDT') DEFAULT NULL,
  `items` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`items`)),
  `timestamp` bigint(20) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `user_phone` (`user_phone`),
  CONSTRAINT `orders_ibfk_1` FOREIGN KEY (`user_phone`) REFERENCES `users` (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orders`
--

LOCK TABLES `orders` WRITE;
/*!40000 ALTER TABLE `orders` DISABLE KEYS */;
/*!40000 ALTER TABLE `orders` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `products`
--

DROP TABLE IF EXISTS `products`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `products` (
  `id` varchar(50) NOT NULL,
  `name` varchar(100) NOT NULL,
  `description` text DEFAULT NULL,
  `prices` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL CHECK (json_valid(`prices`)),
  `category_id` varchar(50) DEFAULT NULL,
  `is_active` tinyint(1) DEFAULT 1,
  PRIMARY KEY (`id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `products_ibfk_1` FOREIGN KEY (`category_id`) REFERENCES `categories` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `products`
--

LOCK TABLES `products` WRITE;
/*!40000 ALTER TABLE `products` DISABLE KEYS */;
INSERT INTO `products` VALUES ('1','MARGUERITA','Queijo mussarela, gouda, orégano e molho tomate','{\"FAMILIAR\": 800, \"MEDIO\": 750, \"PEQ\": 500}','PIZZAS',1),('10','ATUM','Atum, cebola, queijo, molho tomate','{\"FAMILIAR\": 900, \"MEDIO\": 850, \"PEQ\": 650}','PIZZAS',1),('11','VEGETARIANO','Cebola, tomate, pimentão, cogumelo, queijo, molho tomate','{\"FAMILIAR\": 900, \"MEDIO\": 850, \"PEQ\": 600}','PIZZAS',1),('12','ESPECIAL DA CASA','Bacon, cogumelo, nata, queijo, molho tomate','{\"FAMILIAR\": 900, \"MEDIO\": 850, \"PEQ\": 650}','PIZZAS',1),('13','QUATRO ESTAÇÕES','Cogumelo, Fiambre, Chouriço, atum, queijo e tomate','{\"FAMILIAR\": 1000, \"MEDIO\": 850}','PIZZAS',1),('14','TROPICAL','Frutas da época, queijo, molho tomate','{\"FAMILIAR\": 900, \"MEDIO\": 850, \"PEQ\": 600}','PIZZAS',1),('15','MARISCO','Marisco, queijo, molho tomate','{\"FAMILIAR\": 1200, \"MEDIO\": 1000}','PIZZAS',1),('16','CAMARÃO','Camarão, queijo, molho tomate','{\"FAMILIAR\": 1200, \"MEDIO\": 1000}','PIZZAS',1),('17','MADA','Queijo, tomate, Chouriço, Bacon, Camarão e Ananás','{\"FAMILIAR\": 1500}','PIZZAS',1),('18','CALZONE','Recheio à escolha com queijo e molho tomate','{\"FAMILIAR\": 850}','PIZZAS',1),('2','4 QUEIJOS','Queijo mussarela, queijo azul, edem e fogo e molho tomate','{\"FAMILIAR\": 950, \"MEDIO\": 850, \"PEQ\": 650}','PIZZAS',1),('3','FIAMBRE','Fiambre, Queijo e molho tomate','{\"FAMILIAR\": 850, \"MEDIO\": 800, \"PEQ\": 600}','PIZZAS',1),('4','FRANGO','Frango, queijo, molho tomate','{\"FAMILIAR\": 850, \"MEDIO\": 850, \"PEQ\": 600}','PIZZAS',1),('5','CHOURIÇO','Chouriço Queijo e molho tomate','{\"FAMILIAR\": 850, \"MEDIO\": 800, \"PEQ\": 550}','PIZZAS',1),('6','BACON','Bacon, queijo, molho tomate','{\"FAMILIAR\": 850, \"MEDIO\": 800, \"PEQ\": 550}','PIZZAS',1),('7','PRESUNTO','Presunto, queijo, molho tomate','{\"FAMILIAR\": 850, \"MEDIO\": 800, \"PEQ\": 550}','PIZZAS',1),('8','LINGUIÇA E TERRA','Linguiça, queijo da terra e molho tomate','{\"FAMILIAR\": 900, \"MEDIO\": 850, \"PEQ\": 600}','PIZZAS',1),('9','CARNE MOIDA','Carne moída, queijo, molho tomate','{\"FAMILIAR\": 900, \"MEDIO\": 850, \"PEQ\": 600}','PIZZAS',1),('d1','ÁGUA','Água mineral','{\"UN\": 100}','BEBIDAS',1),('d2','COCA-COLA','Refrigerante Coca-Cola','{\"UN\": 300}','BEBIDAS',1),('d3','FANTA LARANJA','Refrigerante Fanta Laranja','{\"UN\": 150}','BEBIDAS',1),('d4','CERVEJA','Cerveja local','{\"UN\": 200}','BEBIDAS',1),('d5','SUMO NATURAL','Sumo natural da casa','{\"UN\": 200}','BEBIDAS',1),('d6','VINHO TINTO','Vinho tinto da região','{\"UN\": 500}','BEBIDAS',1),('test-pizza','Pizza de Teste DB','Teste de migração','{\"FAMILIAR\":1000}','PIZZAS',1);
/*!40000 ALTER TABLE `products` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `settings`
--

DROP TABLE IF EXISTS `settings`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `settings` (
  `key` varchar(50) NOT NULL,
  `value` text DEFAULT NULL,
  PRIMARY KEY (`key`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `settings`
--

LOCK TABLES `settings` WRITE;
/*!40000 ALTER TABLE `settings` DISABLE KEYS */;
/*!40000 ALTER TABLE `settings` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `phone` varchar(20) NOT NULL,
  `name` varchar(100) NOT NULL,
  `points` int(11) DEFAULT 0,
  `orders_count` int(11) DEFAULT 0,
  `level` enum('BRONZE','PRATA','OURO','DIAMANTE') DEFAULT 'BRONZE',
  `is_admin` tinyint(1) DEFAULT 0,
  PRIMARY KEY (`phone`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1 COLLATE=latin1_swedish_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-12-31  0:03:30
