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
  const role: UserRole =
    session.user.role === "organizer" || session.user.role === "admin" ? session.user.role : "user";
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