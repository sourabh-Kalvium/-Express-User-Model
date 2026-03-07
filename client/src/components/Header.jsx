import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Header = () => {
  // Get auth state and logout from context — no direct localStorage access
  const { user, isAuthenticated, logout } = useAuth();

  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <Link to="/" style={styles.link}>TechBlog</Link>
      </div>
      <nav>
        <ul style={styles.navList}>
          <li style={styles.navItem}><Link to="/" style={styles.link}>Home</Link></li>

          {isAuthenticated() ? (
            <>
              <li style={styles.navItem}>
                <Link to="/dashboard" style={styles.link}>Dashboard</Link>
              </li>
              <li style={styles.navItem}>
                <span style={{ color: '#aaa', marginRight: '1rem' }}>
                  Hi, {user?.name?.split(' ')[0]}
                </span>
              </li>
              <li style={styles.navItem}>
                <button onClick={logout} style={styles.logoutBtn}>Logout</button>
              </li>
            </>
          ) : (
            <>
              <li style={styles.navItem}><Link to="/login" style={styles.link}>Login</Link></li>
              <li style={styles.navItem}><Link to="/register" style={styles.link}>Register</Link></li>
            </>
          )}
        </ul>
      </nav>
    </header>
  );
};

const styles = {
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '1rem 2rem',
    backgroundColor: '#282c34',
    color: 'white',
  },
  logo: {
    fontSize: '1.5rem',
    fontWeight: 'bold',
  },
  navList: {
    listStyleType: 'none',
    display: 'flex',
    alignItems: 'center',
    margin: 0,
    padding: 0,
  },
  navItem: { marginLeft: '1.5rem' },
  link: {
    color: 'white',
    textDecoration: 'none',
  },
  logoutBtn: {
    background: 'transparent',
    border: '1px solid #aaa',
    color: 'white',
    padding: '0.3rem 0.8rem',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '0.9rem',
  }
};

export default Header;
