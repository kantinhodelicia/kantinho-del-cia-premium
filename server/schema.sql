-- Database Schema for Kantinho Delícia

CREATE DATABASE IF NOT EXISTS kantinho_db;
USE kantinho_db;

-- Categories Table
CREATE TABLE IF NOT EXISTS categories (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);

-- Products Table
CREATE TABLE IF NOT EXISTS products (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    prices JSON NOT NULL, -- Store as { 'PEQ': 100, 'MEDIO': 200... }
    category_id VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (category_id) REFERENCES categories(id)
);

-- Delivery Zones Table
CREATE TABLE IF NOT EXISTS delivery_zones (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    estimated_time VARCHAR(50)
);

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    phone VARCHAR(20) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    points INT DEFAULT 0,
    orders_count INT DEFAULT 0,
    level ENUM('BRONZE', 'PRATA', 'OURO', 'DIAMANTE') DEFAULT 'BRONZE',
    is_admin BOOLEAN DEFAULT FALSE
);

-- Orders Table
CREATE TABLE IF NOT EXISTS orders (
    id VARCHAR(50) PRIMARY KEY,
    user_phone VARCHAR(20),
    customer_name VARCHAR(100) NOT NULL,
    zone_name VARCHAR(100),
    total DECIMAL(10, 2) NOT NULL,
    status ENUM('RECEBIDO', 'PREPARO', 'PRONTO', 'ENTREGUE', 'CONCLUIDO', 'CANCELADO') DEFAULT 'RECEBIDO',
    payment_method ENUM('DINHEIRO', 'CARTAO', 'USDT'),
    items JSON NOT NULL, -- Array of CartItem objects
    timestamp BIGINT NOT NULL,
    FOREIGN KEY (user_phone) REFERENCES users(phone)
);

-- App Settings
CREATE TABLE IF NOT EXISTS settings (
    `key` VARCHAR(50) PRIMARY KEY,
    value TEXT
);
