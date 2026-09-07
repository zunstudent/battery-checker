const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');

const app = express();
const port = process.env.PORT || 10000;

// Middleware
app.use(cors());
app.use(express.json());

// Koneksi Database (akan diisi nanti saat deploy)
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
});

// Endpoint: Menyimpan data baterai
app.post('/api/battery', async (req, res) => {
    const { level, charging } = req.body;
    const timestamp = new Date();

    try {
        const query = 'INSERT INTO battery_data (level, charging, timestamp) VALUES ($1, $2, $3)';
        await pool.query(query, [level, charging, timestamp]);
        res.status(201).json({ message: 'Data saved successfully!' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ error: 'Failed to save data' });
    }
});

// Endpoint: Dashboard melihat data
app.get('/api/data', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM battery_data ORDER BY timestamp DESC LIMIT 50');
        res.json(result.rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

// Jalankan Server
app.listen(port, () => {
    console.log(`Backend running on port ${port}`);
});