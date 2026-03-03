import React from 'react';

const Home = () => {
    return (
        <div style={styles.container}>
            <h1>Welcome to TechBlog</h1>
            <p>Your one-stop destination for the latest in technology, programming, and software development.</p>

            <div style={styles.articleGrid}>
                <article style={styles.card}>
                    <h3>Understanding React 19</h3>
                    <p>A deep dive into the new features coming in React 19 and how they impact performance.</p>
                </article>
                <article style={styles.card}>
                    <h3>Mastering CSS Grid</h3>
                    <p>Learn how to build complex layouts easily with CSS Grid.</p>
                </article>
                <article style={styles.card}>
                    <h3>Why TypeScript?</h3>
                    <p>The benefits of static typing in modern web applications.</p>
                </article>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingBottom: '80px', // space for footer
    },
    articleGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
        gap: '2rem',
        marginTop: '2rem',
    },
    card: {
        border: '1px solid #ddd',
        borderRadius: '8px',
        padding: '1.5rem',
        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    }
};

export default Home;
