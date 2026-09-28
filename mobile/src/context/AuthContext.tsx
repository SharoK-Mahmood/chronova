import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import { promptGoogleCredential } from "@/src/lib/google-auth";
import { apiClient } from "@/src/lib/api";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/src/storage/token";
import type { AuthSession, User } from "@/src/types/auth";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string,
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const token = await getAccessToken();
        if (!token) {
          return;
        }

        const session = await apiClient<{ user: User }>("/auth/me");
        if (!cancelled) {
          setUser(session.user);
        }
      } catch {
        await clearAccessToken();
        if (!cancelled) {
          setUser(null);
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const applySession = useCallback(async (session: AuthSession) => {
    await setAccessToken(session.accessToken);
    setUser(session.user);
  }, []);

  const login = useCallback(
    async (email: string, password: string) => {
      const session = await apiClient<AuthSession>("/auth/login", {
        method: "POST",
        body: { email, password },
      });
      await applySession(session);
    },
    [applySession],
  );

  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string,
    ) => {
      const session = await apiClient<AuthSession>("/auth/register", {
        method: "POST",
        body: { email, password, firstName, lastName },
      });
      await applySession(session);
    },
    [applySession],
  );

  const loginWithGoogle = useCallback(async () => {
    const credential = await promptGoogleCredential();
    const session = await apiClient<AuthSession>("/auth/google", {
      method: "POST",
      body: { credential },
    });
    await applySession(session);
  }, [applySession]);

  const logout = useCallback(async () => {
    await clearAccessToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      login,
      register,
      loginWithGoogle,
      logout,
    }),
    [user, isLoading, login, register, loginWithGoogle, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
