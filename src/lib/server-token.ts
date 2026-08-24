import { headers } from "next/headers";

import { auth } from "@/lib/auth";

export async function getServerToken(): Promise<string | undefined> {
  try {
    // Better Auth JWT plugin exposes getToken server-side; returns { token } or throws
    const result = await auth.api.getToken({ headers: await headers() });
    return result?.token ?? undefined;
  } catch {
    return undefined;
  }
}