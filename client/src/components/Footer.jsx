import React from 'react';

const Footer = () => {
    return (
        <footer style={styles.footer}>
            <p>&copy; {new Date().getFullYear()} TechBlog. All rights reserved.</p>
        </footer>
    );
};

const styles = {
    footer: {
        padding: '1rem',
        backgroundColor: '#282c34',
        color: 'white',
        textAlign: 'center',
        position: 'fixed',
        bottom: 0,
        width: '100%',
    }
};

export default Footer;
