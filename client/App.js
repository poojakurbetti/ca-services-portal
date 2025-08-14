import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import CustomerServices from './pages/CustomerServices';
import AdminDashboard from './pages/AdminDashboard';
import LoginPage from './pages/LoginPage';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Services from "./pages/Services";
const API_URL = 'http://localhost:4000/api';

function App() {
  const [user, setUser] = useState(null);

  // Get logged-in user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/auth/me`, { withCredentials: true });
        setUser(data);
      } catch (err) {
        setUser(null);
      }
    };
    fetchUser();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<CustomerServices />} />
        <Route path="/login" element={<LoginPage setUser={setUser} />} />

        {/* Admin protected page */}
        <Route
          path="/admin"
          element={
            user?.role === 'admin' ? <AdminDashboard /> : <Navigate to="/login" />
          }
        />

        {/* Fallback */}
        <Route path="*" element={<p>Page not found</p>} />
      </Routes>
    </Router>
  );
}

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Services />} />
          <Route path="/admin" element={<AdminLogin />} />
        </Routes>
      </Router>
    );
  }
export default App;
