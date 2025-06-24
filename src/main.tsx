import React from 'react';
import ReactDOM from 'react-dom/client';
import Router from './routes/Router';
import { AuthProvider } from './context/Auth.Context';
import './style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <Router />
    </AuthProvider>
  </React.StrictMode>
);

