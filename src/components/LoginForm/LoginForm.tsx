import React, { useState } from "react";
import type { FormEvent } from "react";
import { useAuth } from "../../context/AuthContext";
import styles from "./LoginForm.module.css";

const LoginForm: React.FC = () => {
  const { login } = useAuth();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");

    if (!username.trim() || !password.trim()) {
      setError("Prašome įvesti vartotojo vardą ir slaptažodį.");
      return;
    }

    try {
      setIsLoading(true);
      await login(username, password);
      setUsername("");
      setPassword("");
    } catch (err) {
      setError("Prisijungti nepavyko. Bandykite dar kartą.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.loginForm} noValidate>
      <div className={styles.formGroup}>
        <label htmlFor="username">Vartotojo vardas</label>
        <input
          id="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className={styles.input}
          required
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="password">Slaptažodis</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className={styles.input}
          required
        />
      </div>

      {error && (
        <p className={styles.errorMessage} role="alert">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={isLoading}
        className={styles.button}
      >
        {isLoading ? "Prisijungiama..." : "Prisijungti"}
      </button>
    </form>
  );
};

export default LoginForm;

