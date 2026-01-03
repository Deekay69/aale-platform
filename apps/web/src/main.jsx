import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { seedDatabase } from './db/schema'
import { createDemoData } from './utils/createDemoData';

// Expose demo data too for testing
window.createDemoData = createDemoData;

// Seed database on app start
seedDatabase().then(() => {
  console.log('Database initialized');
});

// Log offline status
window.addEventListener('online', () => {
  console.log('✅ Back online');
});

window.addEventListener('offline', () => {
  console.log('📵 Working offline');
});

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
