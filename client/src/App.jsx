import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth Context
import { AuthProvider } from './context/AuthContext';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import NotFound from './pages/NotFound';

function App() {
  return (
    <Router>
      {/* AuthProvider is inside Router so it can use useNavigate */}
      <AuthProvider>
        <div className="app-container" style={{ minHeight: '100vh', position: 'relative' }}>
          <Header />

          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
