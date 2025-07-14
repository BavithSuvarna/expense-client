import { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const [data, setData] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);

  const handleSignup = async () => {
    if (loading) return;

    if (!data.username || !data.email || !data.password) {
      alert('Please fill all fields');
      return;
    }

    setLoading(true);

    const feedbackTimeout = setTimeout(() => {
      alert("Server might be waking up. Please wait a few seconds...");
    }, 3000);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 30000);

    try {
      await axios.post(
        'https://expense-server-9t39.onrender.com/api/auth/signup',
        data,
        { signal: controller.signal }
      );
      clearTimeout(timeout);
      clearTimeout(feedbackTimeout);
      alert('Signup successful! Please login now.');
      window.location.href = '/login';
    } catch (err) {
      clearTimeout(timeout);
      clearTimeout(feedbackTimeout);
      const msg = err.name === 'CanceledError'
        ? 'Signup timed out. Please try again.'
        : err.response?.data?.message || 'Signup failed';
      alert(msg);
      console.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: '20px' }}>Sign Up</h2>

        <input
          type="text"
          placeholder="Username"
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
          style={styles.input}
          disabled={loading}
        />

        <input
          type="email"
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          style={styles.input}
          disabled={loading}
        />

        <input
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          style={styles.input}
          disabled={loading}
        />

        <button
          onClick={handleSignup}
          style={{
            ...styles.button,
            backgroundColor: loading ? '#6c757d' : '#0a66c2',
            cursor: loading ? 'not-allowed' : 'pointer',
            opacity: loading ? 0.8 : 1,
          }}
          disabled={loading}
        >
          {loading ? 'Signing up...' : 'Sign Up'}
        </button>

        <p style={{ marginTop: '15px' }}>
          Already have an account?{' '}
          <a href="/login" style={styles.link}>Login here</a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#dfe3f1ff',
  },
  card: {
    background: '#fff',
    padding: '40px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    width: '300px',
    textAlign: 'center',
  },
  input: {
    width: '90%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    color: '#fff',
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    fontWeight: 'bold',
  },
  link: {
    color: '#0a66c2',
    textDecoration: 'none',
  },
};
