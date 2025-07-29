// pages/CategoryDetails.js
import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';

export default function CategoryDetails() {
  const { category } = useParams();
  const [expenses, setExpenses] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExpenses = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://expense-server-9t39.onrender.com/api/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const filtered = res.data.filter(exp => exp.category === category);
      setExpenses(filtered);
    };

    fetchExpenses();
  }, [category]);

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
        <ul>
          {expenses.map(exp => (
            <li key={exp._id} style={{
              padding: '12px',
              marginBottom: '10px',
              backgroundColor: '#e3f2fd',
              borderRadius: '8px'
            }}>
              <strong>{exp.title}</strong> — ₹{exp.amount} on {new Date(exp.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
