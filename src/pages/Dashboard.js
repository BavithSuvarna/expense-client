import { useEffect, useState, useCallback } from 'react';
import axios from 'axios';
import ExpenseForm from '../components/ExpenseForm';
import ExpenseList from '../components/ExpenseList';
import CategoryChart from '../components/CategoryChart';

export default function Dashboard() {
  const [expenses, setExpenses] = useState([]);
  const [totals, setTotals] = useState({ total: 0, byCategory: {} });
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [username, setUsername] = useState('');

  const fetchUsername = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('https://expense-server-9t39.onrender.com/api/auth/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsername(res.data.username);
    } catch (err) {
      console.error('Error fetching user:', err);
    }
  };

  const fetchExpenses = useCallback(async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('https://expense-server-9t39.onrender.com/api/expenses', {
      headers: { Authorization: `Bearer ${token}` }
    });
    setExpenses(res.data);
    calculateTotals(res.data);
  }, []);

  const calculateTotals = (expenseList) => {
    let total = 0;
    let byCategory = {};

    for (const exp of expenseList) {
      total += exp.amount;
      byCategory[exp.category] = (byCategory[exp.category] || 0) + exp.amount;
    }

    setTotals({ total, byCategory });
  };

  useEffect(() => {
    fetchUsername();
    fetchExpenses();
  }, [fetchExpenses]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  const getFilteredExpenses = () => {
    const now = new Date();
    return expenses.filter((exp) => {
      const expDate = new Date(exp.date);

      if (selectedFilter === 'today') {
        return (
          expDate.getDate() === now.getDate() &&
          expDate.getMonth() === now.getMonth() &&
          expDate.getFullYear() === now.getFullYear()
        );
      }

      if (selectedFilter === 'last7') {
        const diffTime = now - expDate;
        return diffTime / (1000 * 60 * 60 * 24) <= 7;
      }

      if (selectedFilter === 'month') {
        return (
          expDate.getMonth() === now.getMonth() &&
          expDate.getFullYear() === now.getFullYear()
        );
      }

      if (selectedFilter === 'last6months') {
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        return expDate >= sixMonthsAgo && expDate <= now;
      }

      if (selectedFilter === 'year') {
        return expDate.getFullYear() === now.getFullYear();
      }

      return true;
    });
  };

  const filteredExpenses = getFilteredExpenses();

  return (
    <div
      style={{
        maxWidth: '1100px',
        margin: '40px auto',
        padding: '30px',
        borderRadius: '12px',
        fontFamily: 'Segoe UI, sans-serif',
        backgroundColor: '#f7fbff',
        boxShadow: '0 2px 15px rgba(0,0,0,0.1)',
        color: '#333'
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2 style={{ fontSize: '26px' }}> {username ? `${username}'s` : 'Your'} Expense Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{
            backgroundColor: '#e63946',
            color: '#fff',
            border: 'none',
            padding: '8px 18px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold'
          }}
        >
           Logout
        </button>
      </div>

      {/* Summary + Chart */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        marginTop: '25px',
        marginBottom: '40px',
        gap: '20px'
      }}>
        <div style={{
          flex: '1',
          minWidth: '280px',
          padding: '20px',
          borderRadius: '10px',
          backgroundColor: '#e3f2fd',
          borderLeft: '6px solid #2196f3'
        }}>
          <h3>Total Spent: <span style={{ color: '#0d47a1' }}>₹{totals.total}</span></h3>
          <h4 style={{ marginTop: '15px' }}>Category Breakdown:</h4>
          <ul style={{ paddingLeft: '20px' }}>
            {Object.entries(totals.byCategory).map(([cat, amt]) => (
              <li key={cat}><strong>{cat}</strong>: ₹{amt}</li>
            ))}
          </ul>
        </div>

        <div style={{
          flex: '1',
          minWidth: '360px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <CategoryChart expenses={expenses} />
        </div>
      </div>

      {/* Expense Form */}
      <ExpenseForm refresh={fetchExpenses} />

      {/* Filters */}
      <div style={{ margin: '30px 0', textAlign: 'center' }}>
        {[
          ['all', 'All'],
          ['today', 'Today'],
          ['last7', 'Last 7 Days'],
          ['month', 'This Month'],
          ['last6months', 'Last 6 Months'],
          ['year', 'This Year'],
        ].map(([key, label]) => (
          <button
            key={key}
            onClick={() => setSelectedFilter(key)}
            style={{
              margin: '8px',
              padding: '10px 16px',
              backgroundColor: selectedFilter === key ? '#2196f3' : '#fff',
              color: selectedFilter === key ? '#fff' : '#2196f3',
              border: '2px solid #2196f3',
              borderRadius: '5px',
              cursor: 'pointer',
              fontWeight: 'bold',
              transition: '0.3s'
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Expense List */}
      <ExpenseList expenses={filteredExpenses} refresh={fetchExpenses} />

      {/* Filtered Summary */}
      {selectedFilter !== 'all' && (
        <div
          style={{
            marginTop: '40px',
            padding: '25px',
            borderRadius: '12px',
            backgroundColor: '#f0f8ff',
            boxShadow: '0 0 8px rgba(0,0,0,0.1)',
            borderLeft: '6px solid #2196f3'
          }}
        >
          <h3 style={{ fontSize: '18px', marginBottom: '15px', color: '#041f48ff' }}>
            Summary for {
              {
                today: 'Today',
                last7: 'Last 7 Days',
                month: 'This Month',
                last6months: 'Last 6 Months',
                year: 'This Year'
              }[selectedFilter]
            }
          </h3>

          <div style={{ fontSize: '16px', fontWeight: 'bold', marginBottom: '10px', color: '#073156ff' }}>
            Total Spent: ₹{filteredExpenses.reduce((acc, exp) => acc + exp.amount, 0)}
          </div>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', marginTop: '10px' }}>
            {Object.entries(
              filteredExpenses.reduce((catTotals, exp) => {
                catTotals[exp.category] = (catTotals[exp.category] || 0) + exp.amount;
                return catTotals;
              }, {})
            ).map(([cat, amt]) => (
              <div
                key={cat}
                style={{
                  padding: '10px 15px',
                  borderRadius: '8px',
                  backgroundColor: '#e3f2fd',
                  color: '#0d47a1',
                  fontWeight: 500,
                  border: '1px solid #bbdefb'
                }}
              >
                <strong>{cat}</strong>: ₹{amt}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
