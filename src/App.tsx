import React from "react";

const App: React.FC = () => {
  return (
    <main style={{ maxWidth: 960, margin: "0 auto", padding: "2rem" }}>
      <header style={{ marginBottom: "2rem", textAlign: "center" }}>
        <h1>Pet Barbershop</h1>
        <p>Your one-stop salon for pampering your pets</p>
      </header>

      <section style={{ marginBottom: "3rem" }}>
        <h2>Featured Services</h2>
        {/* TODO: Map and render services here */}
        <p>Grooming, Nail trimming, Bathing, and more!</p>
      </section>

      <section style={{ marginBottom: "3rem" }}>
        <h2>Book an Appointment</h2>
        {/* TODO: Add booking form here */}
        <p>Choose your service and pick a convenient time.</p>
      </section>

      <section>
        <h2>Why Choose Us?</h2>
        <ul>
          <li>Experienced groomers</li>
          <li>Pet-friendly environment</li>
          <li>Affordable pricing</li>
          <li>Convenient online booking</li>
        </ul>
      </section>

      <footer style={{ marginTop: "4rem", textAlign: "center", fontSize: "0.9rem", color: "#666" }}>
        &copy; {new Date().getFullYear()} Pet Barbershop. All rights reserved.
      </footer>
    </main>
  );
};

export default App;
