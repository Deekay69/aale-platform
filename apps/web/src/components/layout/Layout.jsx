import React from 'react';
import { Outlet } from 'react-router-dom';
import Header from './Header';
import OfflineIndicator from '../OfflineIndicator';

const Layout = () => {
    return (
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Header />
            <OfflineIndicator />
            <main style={{ flex: 1, paddingTop: '60px' }}>
                <Outlet />
            </main>

            <footer style={{
                backgroundColor: 'var(--bg-active-surface, #f9fafb)',
                borderTop: '1px solid rgba(0,0,0,0.05)',
                padding: '2rem 0',
                marginTop: 'auto',
                textAlign: 'center',
                color: 'var(--text-muted)'
            }}>
                <div className="container">
                    <p>&copy; {new Date().getFullYear()} AALE Platform. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
};

export default Layout;
