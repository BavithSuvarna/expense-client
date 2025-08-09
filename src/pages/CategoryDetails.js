// pages/CategoryDetails.js
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CategoryDetails() {
  const { category } = useParams();
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  // State for inline editing
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', amount: '', category: '', date: '' });
  const [allCategories, setAllCategories] = useState([]);

  const fetchExpenses = async () => {
    try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://expense-server-9t39.onrender.com/api/expenses', {
            headers: { Authorization: `Bearer ${token}` }
        });
        
        // Filter expenses for the current category
        const filtered = res.data.filter(exp => exp.category === category);
        setExpenses(filtered);
        
        // Get all unique categories for the datalist in the edit form
        const uniqueCategories = [...new Set(res.data.map(exp => exp.category))];
        setAllCategories(uniqueCategories);
    } catch (err) {
        console.error("Failed to fetch expenses", err);
    }
  };

  useEffect(() => {
    fetchExpenses();
  }, [category]); // Re-fetch if the category in the URL changes

  // --- Functions for editing and deleting ---

  const deleteExpense = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`https://expense-server-9t39.onrender.com/api/expenses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    fetchExpenses(); // Refresh the list
  };

  const startEditing = (expense) => {
    setEditingId(expense._id);
    setFormData({
      title: expense.title,
      amount: expense.amount,
      category: expense.category,
      date: expense.date ? expense.date.slice(0, 10) : ''
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
  };

  const saveEdit = async (id) => {
    const token = localStorage.getItem('token');
    await axios.put(`https://expense-server-9t39.onrender.com/api/expenses/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEditingId(null);
    // If the category was changed, the user should be redirected
    if (formData.category !== category) {
        navigate(`/category/${encodeURIComponent(formData.category)}`);
    } else {
        fetchExpenses(); // Otherwise, just refresh the current list
    }
  };


  return (
    <div style={{
      maxWidth: '1100px',
      margin: '40px auto',
      padding: '30px',
      borderRadius: '12px',
      backgroundColor: '#f7fbff',
      boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
      fontFamily: 'Segoe UI, sans-serif',
      color: '#333'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#0d47a1' }}>
        Expenses in <em>{category}</em>
      </h2>
      
      <button
        onClick={() => navigate(-1)}
        style={{
          marginBottom: '20px',
          backgroundColor: '#2196f3',
          color: 'white',
          border: 'none',
          padding: '10px 16px',
          borderRadius: '6px',
          cursor: 'pointer'
        }}
      >
        ← Back to Dashboard
      </button>

      {expenses.length === 0 ? (
        <p>No expenses found in this category.</p>
      ) : (
        <div>
          {expenses.map(e => (
            <div
              key={e._id}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '10px',
                marginBottom: '10px',
                border: '1px solid #ddd',
                borderRadius: '6px',
                backgroundColor: '#e3f2fd',
                flexWrap: 'wrap'
              }}
            >
              {editingId === e._id ? (
                <div style={{ flexGrow: 1 }}>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(ev) => setFormData({ ...formData, title: ev.target.value })}
                    placeholder="Title"
                    style={{ marginRight: '5px', marginBottom: '5px' }}
                  />
                  <input
                    type="number"
                    value={formData.amount}
                    onChange={(ev) => setFormData({ ...formData, amount: ev.target.value })}
                    placeholder="Amount"
                    style={{ marginRight: '5px', marginBottom: '5px' }}
                  />
                  <input
                    list="category-options"
                    type="text"
                    value={formData.category}
                    onChange={(ev) => setFormData({ ...formData, category: ev.target.value })}
                    placeholder="Category"
                    style={{ marginRight: '5px', marginBottom: '5px' }}
                  />
                  <datalist id="category-options">
                    {allCategories.map((cat, idx) => <option key={idx} value={cat} />)}
                  </datalist>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(ev) => setFormData({ ...formData, date: ev.target.value })}
                    style={{ marginRight: '10px', marginBottom: '5px' }}
                  />
                </div>
              ) : (
                <div>
                  <strong>{e.title}</strong> — ₹{e.amount} on {new Date(e.date).toLocaleDateString()}
                </div>
              )}

              {editingId === e._id ? (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button onClick={() => saveEdit(e._id)}>Save</button>
                  <button onClick={cancelEdit}>Cancel</button>
                </div>
              ) : (
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', justifyContent: 'flex-end', marginTop: '8px' }}>
                  <button onClick={() => startEditing(e)}>Edit</button>
                  <button
                    onClick={() => deleteExpense(e._id)}
                    style={{ backgroundColor: '#ff4d4f', color: '#fff', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}