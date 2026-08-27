"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  getCurrentUser,
  loginAccount,
  registerAccount,
  type LoginInput,
  type RegisterInput,
} from "@/features/auth/services/auth.service";
import {
  clearAccessToken,
  getAccessToken,
  setAccessToken,
} from "@/features/auth/lib/token-storage";
import type { AuthSession, User } from "@/features/auth/types/auth.types";

type AuthContextValue = {
  user: User | null;
  isHydrated: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (input: LoginInput) => Promise<AuthSession>;
  register: (input: RegisterInput) => Promise<AuthSession>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextValue | null>(null);

type AuthProviderProps = {
  children: ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const token = getAccessToken();

    if (!token) {
      setIsHydrated(true);
      return;
    }

    void getCurrentUser()
      .then((current) => {
        setUser(current);
      })
      .catch(() => {
        clearAccessToken();
        setUser(null);
      })
      .finally(() => {
        setIsHydrated(true);
      });
  }, []);

  const login = useCallback(async (input: LoginInput) => {
    const session = await loginAccount(input);
    setAccessToken(session.accessToken);
    setUser(session.user);
    return session;
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    const session = await registerAccount(input);
    setAccessToken(session.accessToken);
    setUser(session.user);
    return session;
  }, []);

  const logout = useCallback(() => {
    clearAccessToken();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      user,
      isHydrated,
      isAuthenticated: Boolean(user),
      isAdmin: user?.role === "admin",
      login,
      register,
      logout,
    }),
    [user, isHydrated, login, register, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}
