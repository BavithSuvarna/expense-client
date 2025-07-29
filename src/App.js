import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import CategoryDetails from './pages/CategoryDetails'; // ← Add this line

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/category/:category" element={<CategoryDetails />} /> {/* ← Add this */}
      </Routes>
    </BrowserRouter>
  );
}

export default App;
