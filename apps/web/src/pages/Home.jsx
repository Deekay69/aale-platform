import React from 'react';
import { useNavigate } from 'react-router-dom';

const Home = () => {
    const navigate = useNavigate();

    return (
        <div className="container" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                <h1 style={{
                    fontSize: '3.5rem',
                    marginBottom: '1.5rem',
                    background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.1
                }}>
                    Empowering Education Everywhere
                </h1>

                <p style={{
                    fontSize: '1.25rem',
                    color: 'var(--text-muted)',
                    marginBottom: '3rem',
                    lineHeight: 1.6
                }}>
                    The Adaptive African Learning Engine (AALE) provides world-class educational resources even in offline environments. Start your journey with SOMA today.
                </p>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => navigate('/dashboard')}
                        style={{
                            backgroundColor: 'var(--primary)',
                            color: 'white',
                            padding: '1rem 2rem',
                            fontSize: '1.1rem',
                            boxShadow: 'var(--shadow-md)'
                        }}
                    >
                        Start Learning
                    </button>

                    <button style={{
                        backgroundColor: 'transparent',
                        border: '1px solid var(--text-muted)',
                        color: 'var(--text-main)',
                        padding: '1rem 2rem',
                        fontSize: '1.1rem'
                    }}>
                        Learn More
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Home;
