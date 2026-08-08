import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

import { currentUser } from "@/data/users";
import type { User } from "@/types";

/**
 * Mock session context. No persistence, no storage — purely UI state so the
 * navigation can demonstrate signed-in and signed-out experiences. This will be
 * replaced by a real JWT session hook once the backend exists.
 */
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(currentUser);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login: () => setUser(currentUser),
      logout: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
