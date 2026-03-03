import React from 'react';
import { Link } from 'react-router-dom';

const Header = () => {
  return (
    <header style={styles.header}>
      <div style={styles.logo}>
        <Link to="/" style={styles.link}>TechBlog</Link>
      </div>
      <nav>
        <ul style={styles.navList}>
          <li style={styles.navItem}><Link to="/" style={styles.link}>Home</Link></li>
          <li style={styles.navItem}><Link to="/dashboard" style={styles.link}>Dashboard</Link></li>
          <li style={styles.navItem}><Link to="/login" style={styles.link}>Login</Link></li>
          <li style={styles.navItem}><Link to="/register" style={styles.link}>Register</Link></li>
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
    margin: 0,
    padding: 0,
  },
  navItem: {
    marginLeft: '1.5rem',
  },
  link: {
    color: 'white',
    textDecoration: 'none',
  }
};

export default Header;
