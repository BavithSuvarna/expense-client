import { useState, useEffect, useRef } from 'react';
import axios from 'axios';

export default function ExpenseForm({ refresh }) {
  const [form, setForm] = useState({ title: '', amount: '', category: '', date: '' });
  const [categories, setCategories] = useState([]); // unique categories from existing expenses
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const wrapperRef = useRef(null);

  // Fetch existing expenses once to derive categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('https://expense-server-9t39.onrender.com/api/expenses', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const unique = Array.from(new Set(res.data.map((e) => e.category).filter(Boolean)));
        setCategories(unique);
      } catch (err) {
        console.error('Failed to fetch categories', err);
      }
    };

    fetchCategories();
  }, []);

  // Close suggestions when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));

    if (name === 'category') {
      const v = value.trim();
      if (v.length === 0) {
        setSuggestions([]);
        setShowSuggestions(false);
        return;
      }
      const filtered = categories.filter((c) =>
        c.toLowerCase().includes(v.toLowerCase())
      );
      setSuggestions(filtered);
      setShowSuggestions(filtered.length > 0);
    }
  };

  const handleSuggestionClick = (cat) => {
    setForm((prev) => ({ ...prev, category: cat }));
    setShowSuggestions(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('https://expense-server-9t39.onrender.com/api/expenses', form, {
        headers: { Authorization: `Bearer ${token}` },
      });

      // If the user created a new category, add it locally so it's available next time
      if (form.category && !categories.includes(form.category)) {
        setCategories((prev) => [...prev, form.category]);
      }

      setForm({ title: '', amount: '', category: '', date: '' });
      setSuggestions([]);
      setShowSuggestions(false);
      refresh();
    } catch (err) {
      console.error('Failed to add expense', err);
      alert(err.response?.data?.message || 'Failed to add expense');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        gap: '10px',
        flexWrap: 'wrap',
        alignItems: 'center',
        position: 'relative'
      }}
      ref={wrapperRef}
    >
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

      {/* Category field with autocomplete */}
      <div style={{ position: 'relative', minWidth: inputStyle.minWidth }}>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={form.category}
          onChange={handleChange}
          onFocus={() => {
            if (form.category.trim().length > 0) {
              const filtered = categories.filter((c) =>
                c.toLowerCase().includes(form.category.toLowerCase())
              );
              setSuggestions(filtered);
              setShowSuggestions(filtered.length > 0);
            }
          }}
          style={inputStyle}
          required
          autoComplete="off"
        />

        {showSuggestions && suggestions.length > 0 && (
          <ul style={suggestionBoxStyle}>
            {suggestions.map((cat) => (
              <li
                key={cat}
                onClick={() => handleSuggestionClick(cat)}
                style={suggestionItemStyle}
              >
                {cat}
              </li>
            ))}
          </ul>
        )}
      </div>

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
  padding: '10px 12px',
  border: '1px solid #ccc',
  borderRadius: '8px',
  fontSize: '14px',
  minWidth: '160px',
  boxSizing: 'border-box'
};

const buttonStyle = {
  backgroundColor: '#0d6efd',
  color: '#fff',
  padding: '10px 16px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
};

const suggestionBoxStyle = {
  position: 'absolute',
  top: '42px',
  left: 0,
  right: 0,
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '6px',
  maxHeight: '160px',
  overflowY: 'auto',
  zIndex: 50,
  boxShadow: '0 6px 20px rgba(0,0,0,0.08)',
  padding: 0,
  margin: 0,
  listStyle: 'none'
};

const suggestionItemStyle = {
  padding: '8px 10px',
  cursor: 'pointer',
  borderBottom: '1px solid #f1f1f1'
};
