// C:\Users\2004t\Pet-Barbershop\frontend\src\main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';

console.log("Minimal Vite React application test started!"); // THIS MESSAGE IS KEY

const rootElement = document.getElementById('root');

if (rootElement) {
  ReactDOM.createRoot(rootElement).render(
    <React.StrictMode>
      <h1>SUCCESS! Hello from the minimal test!</h1>
      <p>If you see this text, your basic Vite and React setup is fundamentally working.</p>
    </React.StrictMode>
  );
} else {
  console.error("ERROR: Root element with ID 'root' not found in index.html!"); // If this appears, your index.html is missing <div id="root">
}