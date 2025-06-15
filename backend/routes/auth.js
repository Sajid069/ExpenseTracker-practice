const express = require('express');
const { auth } = require('../services/firebase');
const router = express.Router();

// Register user
router.post('/register', async (req, res) => {
  try {
    const { email, password, displayName } = req.body;
    
    const userRecord = await auth.createUser({
      email,
      password,
      displayName
    });

    res.status(201).json({
      message: 'User created successfully',
      uid: userRecord.uid,
      email: userRecord.email
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Verify user token (middleware for protected routes)
router.post('/verify-token', async (req, res) => {
  try {
    const { token } = req.body;
    const decodedToken = await auth.verifyIdToken(token);
    res.json({ uid: decodedToken.uid, email: decodedToken.email });
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
});

module.exports = router;