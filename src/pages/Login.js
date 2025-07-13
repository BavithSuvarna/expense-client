import { useState } from 'react';
import axios from 'axios';

export default function Login() {
  const [data, setData] = useState({ email: '', password: '' });

  const handleLogin = async () => {
    try {
      if (!data.email || !data.password) {
        alert('Please enter both email and password');
        return;
      }

      const res = await axios.post('https://expense-server-9t39.onrender.com/api/auth/login', data);
      localStorage.setItem('token', res.data.token);
      alert('Login successful');
      window.location.href = '/dashboard';
    } catch (err) {
      const msg = err.response?.data?.message || 'Login failed';
      alert(msg);
      console.error(msg);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: '20px' }}>Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={data.email}
          onChange={(e) => setData({ ...data, email: e.target.value })}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Password"
          value={data.password}
          onChange={(e) => setData({ ...data, password: e.target.value })}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.button}>Login</button>

        <p style={{ marginTop: '15px' }}>
          Don’t have an account? <a href="/" style={styles.link}>Sign up here</a>
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
    background: '#e8dfebff',
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
    backgroundColor: '#0a66c2',
    color: '#fff',
    padding: '10px',
    borderRadius: '6px',
    border: 'none',
    cursor: 'pointer',
    fontWeight: 'bold',
  },
  link: {
    color: '#0a66c2',
    textDecoration: 'none'
  }
};
