import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api, { setAuthToken } from "../api/client.js";

const AuthContext = createContext(null);

const STORAGE_KEY = "ttm_auth";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const { token: t, user: u } = JSON.parse(raw);
        if (t) {
          setAuthToken(t);
          setToken(t);
          setUser(u);
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    setReady(true);
  }, []);

  const persist = useCallback((t, u) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: t, user: u }));
  }, []);

  const login = useCallback(
    async (email, password) => {
      const { data } = await api.post("/auth/login", { email, password });
      setAuthToken(data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      persist(data.access_token, data.user);
      return data.user;
    },
    [persist]
  );

  const register = useCallback(
    async (payload) => {
      const { data } = await api.post("/auth/register", payload);
      setAuthToken(data.access_token);
      setToken(data.access_token);
      setUser(data.user);
      persist(data.access_token, data.user);
      return data.user;
    },
    [persist]
  );

  const logout = useCallback(() => {
    setAuthToken(null);
    setToken(null);
    setUser(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const refreshMe = useCallback(async () => {
    if (!token) return;
    try {
      const { data } = await api.get("/auth/me");
      setUser(data);
      persist(token, data);
    } catch {
      logout();
    }
  }, [token, persist, logout]);

  const value = useMemo(
    () => ({
      user,
      token,
      ready,
      login,
      register,
      logout,
      refreshMe,
      isAdmin: user?.role === "admin",
      isAuthenticated: !!user && !!token,
    }),
    [user, token, ready, login, register, logout, refreshMe]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be inside AuthProvider");
  return ctx;
}
