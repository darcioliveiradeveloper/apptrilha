import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  type User,
  apiLogin,
  apiRegister,
  apiMe,
  getToken,
  setToken,
  TOKEN_KEY,
} from "./api";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; code: string }) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const token = getToken();
    if (!token) {
      setLoading(false);
      return;
    }
    apiMe(token)
      .then(({ user }) => {
        if (!cancelled) setUser(user);
      })
      .catch(() => {
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await apiLogin(email, password);
    setToken(token);
    setUser(user);
  }, []);

  const register = useCallback(async (payload: { name: string; email: string; password: string; code: string }) => {
    const { token, user } = await apiRegister(payload);
    setToken(token);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, loading, login, register, logout }),
    [user, loading, login, register, logout],
  );

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useAuth(): AuthCtx {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useAuth deve ser usado dentro de <AuthProvider>");
  return ctx;
}
