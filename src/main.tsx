// src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './routes/Router';
import { AuthProvider } from './context/AuthContext';
import './style.css'; // Ensure this file exists in src/

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error("Root element not found");

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </React.StrictMode>
);


