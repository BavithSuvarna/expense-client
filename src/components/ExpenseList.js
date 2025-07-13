import axios from 'axios';
import { useState } from 'react';

export default function ExpenseList({ expenses, refresh }) {
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ title: '', amount: '', category: '', date: '' });

  const deleteExpense = async (id) => {
    const token = localStorage.getItem('token');
    await axios.delete(`https://expense-server-9t39.onrender.com/api/expenses/${id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    refresh();
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
    setFormData({ title: '', amount: '', category: '', date: '' });
  };

  const saveEdit = async (id) => {
    const token = localStorage.getItem('token');
    await axios.put(`https://expense-server-9t39.onrender.com/api/expenses/${id}`, formData, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setEditingId(null);
    setFormData({ title: '', amount: '', category: '', date: '' });
    refresh();
  };

  return (
    <div style={{ textAlign: 'left' }}>
      {expenses.length === 0 ? (
        <p>No expenses yet. Start by adding some!</p>
      ) : (
        expenses.map((e) => (
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
              backgroundColor: '#f7f7f7',
            }}
          >
            {editingId === e._id ? (
              <div style={{ flexGrow: 1 }}>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Title"
                  style={{ marginRight: '5px' }}
                />
                <input
                  type="number"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  placeholder="Amount"
                  style={{ marginRight: '5px' }}
                />
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  placeholder="Category"
                  style={{ marginRight: '5px' }}
                />
                <input
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  style={{ marginRight: '10px' }}
                />
              </div>
            ) : (
              <div>
                <strong>{e.title}</strong> - ₹{e.amount} ({e.category})<br />
                <small style={{ color: '#555' }}>{new Date(e.date).toLocaleDateString()}</small>
              </div>
            )}

            {editingId === e._id ? (
              <div>
                <button onClick={() => saveEdit(e._id)} style={{ marginRight: '6px' }}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                <button onClick={() => startEditing(e)} style={{ marginRight: '6px' }}>Edit</button>
                <button
                  onClick={() => deleteExpense(e._id)}
                  style={{
                    backgroundColor: '#ff4d4f',
                    color: '#fff',
                    border: 'none',
                    padding: '5px 10px',
                    borderRadius: '4px',
                    cursor: 'pointer',
                  }}
                >
                  Delete
                </button>
              </div>
            )}
          </div>
        ))
      )}
    </div>
  );
}
