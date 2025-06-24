import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from "react";
import axios, { AxiosError } from "axios";

interface AuthContextType {
  user: string | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

const LOCAL_STORAGE_TOKEN_KEY = "token";
const LOCAL_STORAGE_USER_KEY = "user";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper: Decode JWT token expiration (returns UNIX timestamp or null)
function getTokenExpiration(token: string): number | null {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    return payload.exp ? payload.exp * 1000 : null;
  } catch {
    return null;
  }
}

// Helper: Safely access localStorage (guard against SSR)
function safeLocalStorageGet(key: string): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<string | null>(safeLocalStorageGet(LOCAL_STORAGE_USER_KEY));
  const [token, setToken] = useState<string | null>(safeLocalStorageGet(LOCAL_STORAGE_TOKEN_KEY));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto logout if token expired on mount
  useEffect(() => {
    if (!token) return;

    const expiration = getTokenExpiration(token);
    if (expiration && expiration < Date.now()) {
      logout();
    }
  }, [token]);

  // Login method: call backend, store token + user info
  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.post(
        "/token",
        new URLSearchParams({ username, password }),
        { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
      );

      const accessToken = response.data.access_token;
      if (!accessToken) throw new Error("No access token returned");

      setToken(accessToken);
      setUser(username);
      localStorage.setItem(LOCAL_STORAGE_TOKEN_KEY, accessToken);
      localStorage.setItem(LOCAL_STORAGE_USER_KEY, username);
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.detail || "Login failed");
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Login failed");
      }
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // Logout method: clear state + storage
  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(LOCAL_STORAGE_TOKEN_KEY);
    localStorage.removeItem(LOCAL_STORAGE_USER_KEY);
  }, []);

  const isAuthenticated = Boolean(token);

  return (
    <AuthContext.Provider
      value={{ user, token, login, logout, isAuthenticated, loading, error }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error("useAuth must be used within an AuthProvider");
  return context;
};


