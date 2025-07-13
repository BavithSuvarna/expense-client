import { useState } from 'react';
import axios from 'axios';

export default function Signup() {
  const [data, setData] = useState({ username: '', email: '', password: '' });

  const handleSignup = async () => {
    try {
      if (!data.username || !data.email || !data.password) {
        alert('Please fill all fields');
        return;
      }

      await axios.post('https://expense-server-9t39.onrender.com/api/auth/signup', data);
      alert('Signup successful! Please login now.');
      window.location.href = '/login';
    } catch (err) {
      const msg = err.response?.data?.message || 'Signup failed';
      alert(msg);
      console.error(msg);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={{ marginBottom: '20px' }}> Sign Up</h2>

        <input
          type="text"
          placeholder="Username"
          value={data.username}
          onChange={(e) => setData({ ...data, username: e.target.value })}
          style={styles.input}
        />

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

        <button onClick={handleSignup} style={styles.button}>Sign Up</button>

        <p style={{ marginTop: '15px' }}>
          Already have an account? <a href="/login" style={styles.link}>Login here</a>
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
