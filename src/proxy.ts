import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";

type AuthUser = { role?: string };

const guards: { pattern: RegExp; roles: string[] }[] = [
  { pattern: /^\/admin(?:$|\/)/, roles: ["admin"] },
  { pattern: /^\/organizer(?:$|\/)/, roles: ["organizer", "admin"] },
  { pattern: /^\/(?:profile|orders|tickets)(?:$|\/)/, roles: ["user", "organizer", "admin"] },
];

export async function proxy(request: NextRequest) {
  const guard = guards.find((g) => g.pattern.test(request.nextUrl.pathname));
  if (!guard) return NextResponse.next();

  const session = await auth.api.getSession({ headers: request.headers });

  if (!session?.user) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  const role = (session.user as AuthUser).role ?? "user";
  if (!guard.roles.includes(role)) {
    const url = request.nextUrl.clone();
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/organizer/:path*",
    "/profile/:path*",
    "/orders/:path*",
    "/tickets/:path*",
  ],
};