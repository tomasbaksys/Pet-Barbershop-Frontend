// src/App.tsx
import React from "react";
// import { BrowserRouter } from 'react-router-dom'; // <--- REMOVE THIS IMPORT
import Router from "./routes/Router";
import { useAuth } from "./context/AuthContext";

const App: React.FC = () => {
  const { loading } = useAuth();

  return (
    // <BrowserRouter> {/* <--- REMOVE THIS WRAPPER */}
      <main style={{
        maxWidth: 960,
        margin: "0 auto",
        padding: "2rem",
        minHeight: "60vh"
      }}>
        <header style={{ marginBottom: "2rem", textAlign: "center" }}>
          <h1>Pet Barbershop</h1>
          <p>Your one-stop salon for pampering your pets</p>
        </header>

        {loading ? (
          <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: 300
          }}>
            <p>Loading application...</p>
          </div>
        ) : (
          <Router />
        )}

        <footer style={{
          marginTop: "4rem",
          textAlign: "center",
          fontSize: "0.9rem",
          color: "#666"
        }}>
          &copy; {new Date().getFullYear()} Pet Barbershop. All rights reserved.
        </footer>
      </main>
    // </BrowserRouter> {/* <--- REMOVE THIS WRAPPER */}
  );
};

export default App; // Ensure you have this export