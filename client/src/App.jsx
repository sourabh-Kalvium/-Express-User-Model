import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// Auth Context
import { AuthProvider } from './context/AuthContext';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import PublicRoute from './components/PublicRoute';

// Layout Components
import Header from './components/Header';
import Footer from './components/Footer';

// Page Components
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import CreatePost from './pages/CreatePost';
import EditPost from './pages/EditPost';
import NotFound from './pages/NotFound';

// Toastify & Hot Toast
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <Router>
      {/* AuthProvider is inside Router so it can use useNavigate */}
      <AuthProvider>
        <div className="app-container" style={{ minHeight: '100vh', position: 'relative' }}>
          <Header />
          <ToastContainer position="top-right" autoClose={3000} />
          <Toaster />

          <main>
            <Routes>
              {/* Public Routes — accessible by everyone */}
              <Route path="/" element={<Home />} />

              {/* Public-only Routes — redirect to dashboard if already logged in */}
              <Route path="/login" element={
                <PublicRoute><Login /></PublicRoute>
              } />
              <Route path="/register" element={
                <PublicRoute><Register /></PublicRoute>
              } />

              {/* Protected Routes — redirect to login if not authenticated */}
              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/create-post" element={
                <ProtectedRoute><CreatePost /></ProtectedRoute>
              } />
              <Route path="/edit-post/:id" element={
                <ProtectedRoute><EditPost /></ProtectedRoute>
              } />

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

