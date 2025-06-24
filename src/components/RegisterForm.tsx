import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const RegisterForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSalonOwner, setIsSalonOwner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          password,
          is_salon_owner: isSalonOwner,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Registration failed");
      }

      // After successful registration, auto-login
      await login(username, password);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="register-form">
      <h2>Registracija</h2>

      <label htmlFor="username">Vartotojo vardas</label>
      <input
        id="username"
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        required
        autoComplete="username"
      />

      <label htmlFor="password">Slaptažodis</label>
      <input
        id="password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
        autoComplete="new-password"
      />

      <label>
        <input
          type="checkbox"
          checked={isSalonOwner}
          onChange={() => setIsSalonOwner(!isSalonOwner)}
        />
        Esu kirpyklos savininkas
      </label>

      {error && <p className="error">{error}</p>}

      <button type="submit" disabled={loading}>
        {loading ? "Registracija..." : "Registruotis"}
      </button>
    </form>
  );
};

export default RegisterForm;
