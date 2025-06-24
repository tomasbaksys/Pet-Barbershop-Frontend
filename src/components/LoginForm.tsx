import React, { useState, FormEvent } from "react";
import { useAuth } from "../context/AuthContext";

const LoginForm: React.FC = () => {
  const { login, loading, error } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      alert("Prašome įvesti vartotojo vardą ir slaptažodį."); // Lithuanian: Please enter username and password.
      return;
    }

    try {
      await login(username, password);
      // Optionally redirect or show success here
    } catch {
      // error state handled by context
    }
  };

  return (
    <form onSubmit={handleSubmit} className="login-form" noValidate>
      <div className="form-group">
        <label htmlFor="username">Vartotojo vardas</label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          disabled={loading}
          autoComplete="username"
          required
        />
      </div>

      <div className="form-group">
        <label htmlFor="password">Slaptažodis</label>
        <input
          type="password"
          id="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          disabled={loading}
          autoComplete="current-password"
          required
        />
      </div>

      {error && <p className="error-message" role="alert">{error}</p>}

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? "Prisijungiama..." : "Prisijungti"}
      </button>
    </form>
  );
};

export default LoginForm;

