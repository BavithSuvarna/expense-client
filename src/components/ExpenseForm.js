import { useState } from 'react';
import axios from 'axios';

export default function ExpenseForm({ refresh }) {
  const [form, setForm] = useState({ title: '', amount: '', category: '', date: '' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');
    await axios.post('https://expense-server-9t39.onrender.com/api/expenses', form, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setForm({ title: '', amount: '', category: '', date: '' });
    refresh();
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
      <input
        type="text"
        name="title"
        placeholder="Title"
        value={form.title}
        onChange={handleChange}
        style={inputStyle}
        required
      />
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={form.amount}
        onChange={handleChange}
        style={inputStyle}
        required
      />
      <input
        type="text"
        name="category"
        placeholder="Category"
        value={form.category}
        onChange={handleChange}
        style={inputStyle}
        required
      />
      <input
        type="date"
        name="date"
        value={form.date}
        onChange={handleChange}
        style={inputStyle}
        required
      />
      <button type="submit" style={buttonStyle}>
        ➕ Add
      </button>
    </form>
  );
}

const inputStyle = {
  padding: '8px 12px',
  border: '1px solid #ccc',
  borderRadius: '6px',
  fontSize: '14px',
  minWidth: '140px',
};

const buttonStyle = {
  backgroundColor: '#0d6efd',
  color: '#fff',
  padding: '8px 16px',
  border: 'none',
  borderRadius: '6px',
  cursor: 'pointer',
  fontWeight: 'bold',
};
