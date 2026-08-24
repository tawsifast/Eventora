import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import type { UserRole } from "@/types";

export interface SessionUser {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  role: UserRole;
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session?.user) return null;
  const rawRole: string | null = session.user.role ?? null;
  let role: UserRole = "user";
  if (rawRole) {
    const lower = rawRole.toLowerCase();
    if (lower === "organizer") role = "organizer" as UserRole;
    else if (lower === "admin") role = "admin" as UserRole;
    else role = "user";
  }
  return {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image,
    role,
  };
}

export function isAllowedRole(user: { role: UserRole } | null, roles: UserRole[]): boolean {
  return user !== null && roles.includes(user.role);
}