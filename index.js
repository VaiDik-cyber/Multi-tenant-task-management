const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const helmet = require('helmet');
const authRoutes = require('./routes/authRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Import DB config (so it initializes pool) - optional since models import it, 
// but good to ensure env vars are checked early or similar. 
// Actually we can just remove the dbConfig block from here since we use config/db.js now.
const db = require('./config/db');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(helmet());
app.use(cors());
app.use(express.json());

// Routes
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);
app.use('/analytics', analyticsRoutes);

// Health check uses the new db import
app.get('/', (req, res) => {
  res.send('Multi-tenant Task Management Backend is running!');
});

app.get('/health', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT 1');
    res.json({ status: 'ok', db: 'connected' });
  } catch (err) {
    console.error('Database connection failed:', err);
    res.status(500).json({ status: 'error', db: 'disconnected', error: err.message });
  }
});



app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
