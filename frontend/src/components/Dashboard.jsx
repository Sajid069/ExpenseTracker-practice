import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

const Dashboard = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);
  const [newExpense, setNewExpense] = useState({
    amount: '',
    description: '',
    category: '',
    date: new Date().toISOString().split('T')[0]
  });

  const { currentUser, logout } = useAuth();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const data = await api.getExpenses(currentUser.uid);
      setExpenses(data);
    } catch (error) {
      console.error('Error fetching expenses:', error);
    }
    setLoading(false);
  };

  const handleAddExpense = async (e) => {
    e.preventDefault();
    try {
      const expenseData = {
        ...newExpense,
        userId: currentUser.uid
      };
      const addedExpense = await api.addExpense(expenseData);
      setExpenses([...expenses, addedExpense]);
      resetForm();
    } catch (error) {
      console.error('Error adding expense:', error);
    }
  };

  const handleEditExpense = async (e) => {
    e.preventDefault();
    try {
      const updatedExpense = await api.updateExpense(editingExpense.id, {
        ...newExpense,
        userId: currentUser.uid
      });
      
      setExpenses(expenses.map(expense => 
        expense.id === editingExpense.id ? updatedExpense : expense
      ));
      
      resetForm();
    } catch (error) {
      console.error('Error updating expense:', error);
    }
  };

  const handleDeleteExpense = async (expenseId) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await api.deleteExpense(expenseId);
        setExpenses(expenses.filter(expense => expense.id !== expenseId));
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    }
  };

  const startEditing = (expense) => {
    setEditingExpense(expense);
    setNewExpense({
      amount: expense.amount.toString(),
      description: expense.description,
      category: expense.category,
      date: new Date(expense.date.seconds * 1000).toISOString().split('T')[0]
    });
    setDialogOpen(true);
  };

  const startAdding = () => {
    setEditingExpense(null);
    setNewExpense({
      amount: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
    setDialogOpen(true);
  };

  const resetForm = () => {
    setEditingExpense(null);
    setNewExpense({
      amount: '',
      description: '',
      category: '',
      date: new Date().toISOString().split('T')[0]
    });
    setDialogOpen(false);
  };

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Simple Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">ExpenseTracker</h1>
            <span className="ml-4 text-gray-500">Welcome, {currentUser.email.split('@')[0]}</span>
          </div>
          <Button onClick={logout} className="bg-gray-800 hover:bg-gray-900 text-white">
            Logout
          </Button>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 py-8">
        {/* Summary and Add Button */}
        <div className="flex justify-between items-center mb-8">
          <Card className="flex-1 mr-4">
            <CardHeader className="pb-3">
              <CardTitle>Total Expenses</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">
                ${totalExpenses.toFixed(2)}
              </div>
              <p className="text-gray-600 text-sm mt-1">{expenses.length} transactions</p>
            </CardContent>
          </Card>
          
          <Button onClick={startAdding} size="lg" className="bg-gray-800 hover:bg-gray-900 text-white px-6 py-3">
            + Add New Expense
          </Button>
        </div>

        {/* Add/Edit Expense Dialog */}
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-md bg-gray-800 text-white border-gray-700">
            <DialogHeader>
              <DialogTitle className="text-white">{editingExpense ? 'Edit Expense' : 'Add New Expense'}</DialogTitle>
              <DialogDescription className="text-gray-300">
                {editingExpense ? 'Update your expense details below.' : 'Enter the details for your new expense.'}
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={editingExpense ? handleEditExpense : handleAddExpense} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="amount" className="text-white">Amount ($)</Label>
                <Input
                  id="amount"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  value={newExpense.amount}
                  onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description" className="text-white">Description</Label>
                <Input
                  id="description"
                  type="text"
                  placeholder="What did you buy?"
                  className="bg-gray-700 border-gray-600 text-white placeholder:text-gray-400"
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category" className="text-white">Category</Label>
                <select
                  id="category"
                  className="flex h-10 w-full rounded-md border bg-gray-700 border-gray-600 text-white px-3 py-2 text-sm"
                  value={newExpense.category}
                  onChange={(e) => setNewExpense({...newExpense, category: e.target.value})}
                  required
                >
                  <option value="" className="bg-gray-700">Select Category</option>
                  <option value="food" className="bg-gray-700">🍔 Food</option>
                  <option value="transport" className="bg-gray-700">🚗 Transport</option>
                  <option value="entertainment" className="bg-gray-700">🎬 Entertainment</option>
                  <option value="utilities" className="bg-gray-700">💡 Utilities</option>
                  <option value="shopping" className="bg-gray-700">🛍️ Shopping</option>
                  <option value="health" className="bg-gray-700">🏥 Health</option>
                  <option value="other" className="bg-gray-700">📋 Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="date" className="text-white">Date</Label>
                <Input
                  id="date"
                  type="date"
                  className="bg-gray-700 border-gray-600 text-white"
                  value={newExpense.date}
                  onChange={(e) => setNewExpense({...newExpense, date: e.target.value})}
                  required
                />
              </div>
              
              <div className="flex gap-3 pt-4">
                <Button type="button" onClick={resetForm} className="flex-1 bg-gray-600 hover:bg-gray-700 text-white">
                  Cancel
                </Button>
                <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700 text-white">
                  {editingExpense ? 'Update Expense' : 'Add Expense'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>

        {/* Expenses Grid */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Expenses</CardTitle>
          </CardHeader>
          <CardContent>
            {expenses.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">No expenses yet</h3>
                <p className="text-gray-600 mb-4">Start tracking your expenses by adding your first transaction.</p>
                <Button onClick={startAdding} className="bg-gray-800 hover:bg-gray-900 text-white">Add Your First Expense</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {expenses.map((expense) => (
                  <Card key={expense.id} className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center mb-2">
                            <span className="text-2xl mr-2">
                              {expense.category === 'food' ? '🍔' :
                               expense.category === 'transport' ? '🚗' :
                               expense.category === 'entertainment' ? '🎬' :
                               expense.category === 'utilities' ? '💡' :
                               expense.category === 'shopping' ? '🛍️' :
                               expense.category === 'health' ? '🏥' : '📋'}
                            </span>
                            <h4 className="font-semibold text-gray-900 truncate">
                              {expense.description}
                            </h4>
                          </div>
                          <p className="text-sm text-gray-600 capitalize mb-1">
                            {expense.category}
                          </p>
                          <p className="text-xs text-gray-500">
                            {new Date(expense.date.seconds * 1000).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <div className="text-xl font-bold text-red-600">
                          ${expense.amount.toFixed(2)}
                        </div>
                        <div className="flex space-x-2">
                          <Button
                            size="sm"
                            onClick={() => startEditing(expense)}
                            className="p-2 bg-blue-600 hover:bg-blue-700 text-white"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => handleDeleteExpense(expense.id)}
                            className="p-2 bg-red-600 hover:bg-red-700 text-white"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;