const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Categories
app.get('/api/categories', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM categories');
        res.json(rows);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/categories', async (req, res) => {
    const { id, name } = req.body;
    try {
        await pool.query('INSERT INTO categories (id, name) VALUES (?, ?)', [id, name]);
        res.status(201).json({ id, name });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Products
app.get('/api/products', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM products');
        res.json(rows.map(p => ({
            id: p.id,
            name: p.name,
            description: p.description,
            prices: typeof p.prices === 'string' ? JSON.parse(p.prices) : p.prices,
            category: p.category_id, // Map category_id to category
            isActive: !!p.is_active
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/products', async (req, res) => {
    const { id, name, description, prices, category_id, is_active } = req.body;
    try {
        await pool.query(
            'INSERT INTO products (id, name, description, prices, category_id, is_active) VALUES (?, ?, ?, ?, ?, ?)',
            [id, name, description, JSON.stringify(prices), category_id, is_active]
        );
        res.status(201).json(req.body);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/products/:id', async (req, res) => {
    const { id } = req.params;
    const updates = req.body;
    const fields = Object.keys(updates).map(key => `${key} = ?`).join(', ');
    const values = Object.values(updates).map(val => typeof val === 'object' ? JSON.stringify(val) : val);

    try {
        await pool.query(`UPDATE products SET ${fields} WHERE id = ?`, [...values, id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Zones
app.get('/api/zones', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM delivery_zones');
        res.json(rows.map(z => ({
            id: z.id,
            name: z.name,
            price: Number(z.price),
            time: z.estimated_time // Map estimated_time to time
        })));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/zones', async (req, res) => {
    const { id, name, price, estimated_time } = req.body;
    try {
        await pool.query(
            'INSERT INTO delivery_zones (id, name, price, estimated_time) VALUES (?, ?, ?, ?)',
            [id, name, price, estimated_time]
        );
        res.status(201).json(req.body);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Orders
app.get('/api/orders', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM orders ORDER BY timestamp DESC LIMIT 200');
        res.json(rows.map(o => {
            const items = typeof o.items === 'string' ? JSON.parse(o.items) : o.items;
            return {
                id: o.id,
                timestamp: Number(o.timestamp),
                total: Number(o.total),
                itemsCount: Array.isArray(items) ? items.length : 0,
                customerName: o.customer_name,
                customerPhone: o.user_phone,
                zoneName: o.zone_name,
                status: o.status,
                paymentMethod: o.payment_method,
                items: items
            };
        }));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/orders', async (req, res) => {
    const { id, user_phone, customer_name, zone_name, total, status, payment_method, items, timestamp } = req.body;
    try {
        await pool.query(
            'INSERT INTO orders (id, user_phone, customer_name, zone_name, total, status, payment_method, items, timestamp) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
            [id, user_phone, customer_name, zone_name, total, status, payment_method, JSON.stringify(items), timestamp]
        );
        res.status(201).json(req.body);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.patch('/api/orders/:id', async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;
    try {
        await pool.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Users
app.get('/api/users/:phone', async (req, res) => {
    const { phone } = req.params;
    try {
        const [rows] = await pool.query('SELECT * FROM users WHERE phone = ?', [phone]);
        res.json(rows[0] || null);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/users', async (req, res) => {
    const { phone, name, points, orders_count, level, is_admin } = req.body;
    try {
        await pool.query(
            'INSERT INTO users (phone, name, points, orders_count, level, is_admin) VALUES (?, ?, ?, ?, ?, ?) ON DUPLICATE KEY UPDATE name=?, points=?, orders_count=?, level=?, is_admin=?',
            [phone, name, points, orders_count, level, is_admin, name, points, orders_count, level, is_admin]
        );
        res.status(201).json(req.body);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Settings
app.get('/api/settings', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM settings');
        const settings = {};
        rows.forEach(r => settings[r.key] = r.value);
        res.json(settings);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/settings', async (req, res) => {
    const { key, value } = req.body;
    try {
        await pool.query(
            'INSERT INTO settings (`key`, value) VALUES (?, ?) ON DUPLICATE KEY UPDATE value = ?',
            [key, value, value]
        );
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
