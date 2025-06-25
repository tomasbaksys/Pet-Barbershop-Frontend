import React, { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./RegisterForm.module.css";

const RegisterForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isSalonOwner, setIsSalonOwner] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          is_salon_owner: isSalonOwner,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.detail || "Registracija nepavyko");
      }

      await login(username, password);
    } catch (err: any) {
      setError(err.message || "Klaida registruojantis");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.registerForm} noValidate>
      <h2 className={styles.title}>Registracija</h2>

      <div className={styles.formGroup}>
        <label htmlFor="username">Vartotojo vardas</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          autoComplete="username"
          className={styles.input}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Slaptažodis</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="new-password"
          className={styles.input}
        />
      </div>

      <div className={styles.checkboxGroup}>
        <label>
          <input
            type="checkbox"
            checked={isSalonOwner}
            onChange={() => setIsSalonOwner(!isSalonOwner)}
          />
          Esu kirpyklos savininkas
        </label>
      </div>

      {error && (
        <p className={styles.errorMessage} role="alert">
          {error}
        </p>
      )}

      <button type="submit" className={styles.button} disabled={loading}>
        {loading ? "Registracija..." : "Registruotis"}
      </button>
    </form>
  );
};

export default RegisterForm;

