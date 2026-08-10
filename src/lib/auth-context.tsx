import { createContext, useContext, useMemo, type ReactNode } from "react";

import { authClient } from "@/lib/auth-client";
import type { User, UserRole } from "@/types";

/**
 * Real session context backed by Better Auth. The auth server lives in this
 * Next.js app (src/app/api/auth/[...all]) and persists sessions to Postgres,
 * so login/logout state survives page refreshes.
 */
interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isPending: boolean;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function initialsFromName(name: string): string {
  return (
    name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("") || "U"
  );
}

function toDomainUser(u: {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  joinedAt?: Date;
  createdAt: Date;
  role?: string | null;
}): User {
  const role: UserRole = u.role === "organizer" || u.role === "admin" ? u.role : "user";
  return {
    id: u.id,
    name: u.name,
    email: u.email,
    role,
    status: "active",
    initials: initialsFromName(u.name),
    avatarUrl: u.image ?? undefined,
    joinedAt: (u.joinedAt ?? u.createdAt).toISOString().slice(0, 10),
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data, isPending } = authClient.useSession();

  const user = data?.user ? toDomainUser(data.user) : null;

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isPending,
      logout: async () => {
        await authClient.signOut();
      },
    }),
    [user, isPending],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
