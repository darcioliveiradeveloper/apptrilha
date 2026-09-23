import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import {
  type User,
  apiLogin,
  apiRegister,
  apiMe,
  getToken,
  setToken,
  TOKEN_KEY,
  getCachedUser,
  setCachedUser,
  clearCachedUser,
} from "./api";

interface AuthCtx {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (payload: { name: string; email: string; password: string; code: string }) => Promise<void>;
  logout: () => void;
}

const Ctx = createContext<AuthCtx | null>(null);

function isNetworkError(err: unknown): boolean {
  if (err instanceof TypeError) return true;
  const msg = err instanceof Error ? err.message : String(err);
  return /Failed to fetch|NetworkError|ECONN|aborted|timed\s*out|gateway|socket|DNS/i.test(msg);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    const token = getToken();
    const cached = getCachedUser();

    if (!token) {
      setLoading(false);
      return;
    }
    // sessao local: abre na hora (sem esperar o servidor "acordar")
    if (cached) {
      setUser(cached);
      setLoading(false);
    }
    // revalida a sessao em segundo plano
    apiMe(token)
      .then(({ user: fresh }) => {
        if (cancelled) return;
        setUser(fresh);
        setCachedUser(fresh);
      })
      .catch((err: unknown) => {
        if (cancelled) return;
        // sem internet (ou servidor dormindo): mantem a sessao em cache
        if (isNetworkError(err) && getCachedUser()) return;
        // 401/invalida: desloga de verdade
        setToken(null);
        localStorage.removeItem(TOKEN_KEY);
        clearCachedUser();
        setUser(null);
      })
      .finally(() => {
        if (!cancelled && !cached) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { token, user } = await apiLogin(email, password);
    setToken(token);
    setCachedUser(user);
    setUser(user);
  }, []);

  const register = useCallback(async (payload: { name: string; email: string; password: string; code: string }) => {
    const { token, user } = await apiRegister(payload);
    setToken(token);
    setCachedUser(user);
    setUser(user);
  }, []);

  const logout = useCallback(() => {
    clearCachedUser();
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
