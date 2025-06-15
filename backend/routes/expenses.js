const express = require('express');
const { db } = require('../services/firebase');
const router = express.Router();

// Get all expenses for a user
router.get('/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const expensesRef = db.collection('expenses').where('userId', '==', userId);
    const snapshot = await expensesRef.get();
    
    const expenses = [];
    snapshot.forEach(doc => {
      expenses.push({ id: doc.id, ...doc.data() });
    });

    res.json(expenses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add new expense
router.post('/', async (req, res) => {
  try {
    const { userId, amount, description, category, date } = req.body;
    
    const expenseData = {
      userId,
      amount: parseFloat(amount),
      description,
      category,
      date: new Date(date),
      createdAt: new Date()
    };

    const docRef = await db.collection('expenses').add(expenseData);
    res.status(201).json({ id: docRef.id, ...expenseData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Update expense
router.put('/:expenseId', async (req, res) => {
  try {
    const { expenseId } = req.params;
    const { userId, amount, description, category, date } = req.body;
    
    const expenseData = {
      userId,
      amount: parseFloat(amount),
      description,
      category,
      date: new Date(date),
      updatedAt: new Date()
    };

    await db.collection('expenses').doc(expenseId).update(expenseData);
    res.json({ id: expenseId, ...expenseData });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete expense
router.delete('/:expenseId', async (req, res) => {
  try {
    const { expenseId } = req.params;
    await db.collection('expenses').doc(expenseId).delete();
    res.json({ message: 'Expense deleted successfully' });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

module.exports = router;