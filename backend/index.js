const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { db } = require('./services/firebase');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running!' });
});

// Firebase test route
app.get('/api/firebase-test', async (req, res) => {
  try {
    await db.collection('test').doc('connection').set({
      message: 'Firebase connected successfully!',
      timestamp: new Date()
    });
    res.json({ message: 'Firebase connection successful!' });
  } catch (error) {
    res.status(500).json({ error: 'Firebase connection failed', details: error.message });
  }
});

// Import routes
const authRoutes = require('./routes/auth');
const expenseRoutes = require('./routes/expenses');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/expenses', expenseRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});