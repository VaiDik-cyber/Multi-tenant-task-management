const express = require('express');
const mysql = require('mysql2');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

const dbConfig = {
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || process.env.DB_PASS,
  database: process.env.DB_NAME,
};

// Create a connection pool
const pool = mysql.createPool(dbConfig);
const promisePool = pool.promise();

app.get('/', (req, res) => {
  res.send('Multi-tenant Task Management Backend is running!');
});

app.get('/health', async (req, res) => {
  try {
    const [rows] = await promisePool.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    console.error('Database connection failed:', err);
    res.status(500).json({ status: 'error', db: 'disconnected', error: err.message });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
