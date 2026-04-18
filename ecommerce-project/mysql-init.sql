-- MySQL 初始化脚本
CREATE DATABASE IF NOT EXISTS ecommerce CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE ecommerce;

-- 创建用户表
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    avatar VARCHAR(500) DEFAULT '',
    role ENUM('user', 'admin') DEFAULT 'user',
    is_active BOOLEAN DEFAULT TRUE,
    last_login DATETIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_email (email),
    INDEX idx_created_at (created_at)
);

-- 创建商品表
CREATE TABLE IF NOT EXISTS products (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    price DECIMAL(10,2) NOT NULL,
    images JSON NOT NULL,
    category ENUM('电子产品', '服装鞋帽', '家用电器', '图书音像', '运动户外', '美妆护肤', '食品饮料', '家居生活', '母婴用品', '其他') NOT NULL,
    brand VARCHAR(100),
    stock INT NOT NULL DEFAULT 0,
    sku VARCHAR(100) NOT NULL UNIQUE,
    weight DECIMAL(8,3),
    dimensions JSON,
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    rating DECIMAL(2,1) DEFAULT 0.0,
    num_reviews INT DEFAULT 0,
    tags JSON,
    created_by INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_price (price),
    INDEX idx_rating (rating),
    INDEX idx_created_at (created_at),
    INDEX idx_sku (sku),
    FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
);

-- 创建商品评价表
CREATE TABLE IF NOT EXISTS product_reviews (
    id INT PRIMARY KEY AUTO_INCREMENT,
    product_id INT NOT NULL,
    user_id INT NOT NULL,
    user_name VARCHAR(50) NOT NULL,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_product_id (product_id),
    INDEX idx_user_id (user_id),
    FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 创建订单表
CREATE TABLE IF NOT EXISTS orders (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    order_items JSON NOT NULL,
    shipping_address JSON NOT NULL,
    payment_method ENUM('支付宝', '微信支付', '银行卡', '货到付款') NOT NULL,
    payment_result JSON,
    items_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    shipping_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    tax_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    total_price DECIMAL(10,2) NOT NULL DEFAULT 0.00,
    is_paid BOOLEAN DEFAULT FALSE,
    paid_at DATETIME,
    is_delivered BOOLEAN DEFAULT FALSE,
    delivered_at DATETIME,
    order_status ENUM('待付款', '已付款', '已发货', '已完成', '已取消') DEFAULT '待付款',
    order_notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_id (user_id),
    INDEX idx_order_status (order_status),
    INDEX idx_is_paid (is_paid),
    INDEX idx_is_delivered (is_delivered),
    INDEX idx_created_at (created_at),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 插入管理员用户（密码: admin123）
INSERT INTO users (name, email, password, role) VALUES
('管理员', 'admin@example.com', '$2a$10$rmL9nQ7QY8Z8Q8Q8Q8Q8QeQ8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8Q8', 'admin')
ON DUPLICATE KEY UPDATE name = '管理员', role = 'admin';

-- 插入示例商品
INSERT INTO products (name, description, price, images, category, stock, sku, brand, created_by) VALUES
('智能手机', '最新款智能手机，性能强劲', 2999.00, '["https://via.placeholder.com/300x300"]', '电子产品', 50, 'PHONE001', '品牌A', 1),
('笔记本电脑', '轻薄便携，办公娱乐两不误', 5999.00, '["https://via.placeholder.com/300x300"]', '电子产品', 30, 'LAPTOP001', '品牌B', 1),
('运动鞋', '舒适透气，运动首选', 399.00, '["https://via.placeholder.com/300x300"]', '服装鞋帽', 100, 'SHOES001', '品牌C', 1),
('咖啡机', '专业级咖啡机，在家享受咖啡时光', 1299.00, '["https://via.placeholder.com/300x300"]', '家用电器', 25, 'COFFEE001', '品牌D', 1)
ON DUPLICATE KEY UPDATE name = VALUES(name), price = VALUES(price);

SELECT 'MySQL 数据库初始化完成' as message;