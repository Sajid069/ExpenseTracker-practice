const API_BASE_URL = 'http://localhost:3000/api';

export const api = {
  // Auth endpoints
  register: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData)
    });
    return response.json();
  },

  verifyToken: async (token) => {
    const response = await fetch(`${API_BASE_URL}/auth/verify-token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    });
    return response.json();
  },

  // Expense endpoints
  getExpenses: async (userId) => {
    const response = await fetch(`${API_BASE_URL}/expenses/${userId}`);
    return response.json();
  },

  addExpense: async (expenseData) => {
    const response = await fetch(`${API_BASE_URL}/expenses`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData)
    });
    return response.json();
  },

  updateExpense: async (expenseId, expenseData) => {
    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(expenseData)
    });
    return response.json();
  },

  deleteExpense: async (expenseId) => {
    const response = await fetch(`${API_BASE_URL}/expenses/${expenseId}`, {
      method: 'DELETE'
    });
    return response.json();
  }
};