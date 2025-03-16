
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { initializeAuthStore } from './store/authStore.ts'

// Initialize auth store on app load
initializeAuthStore();

createRoot(document.getElementById("root")!).render(<App />);
