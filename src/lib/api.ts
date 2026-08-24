/**
 * Simple fetch helpers for the Eventora backend API.
 *
 * Every function:
 *   1. fetches the API URL
 *   2. parses the JSON response
 *   3. checks response.ok
 *   4. returns result.data
 *   5. throws Error(result.message) when the request fails
 *
 * `NEXT_PUBLIC_SERVER_URL` points to the backend API base URL.
 * If empty, Next.js rewrites `/api/*` to the backend (same-origin).
 *
 * Token handling:
 * - If `token` is explicitly provided → `Authorization: Bearer ${token}` header
 * - If `token` is omitted and running in browser → auto-inject via `authClient.token()`
 * - If `token` is omitted and NOT in browser (RSC) → no auth header (public endpoints)
 */

import { authClient } from "./auth-client";

const API_URL = process.env.NEXT_PUBLIC_SERVER_URL || "";

// 👇 Auto‑inject helper (async because it may fetch a token)
export async function getAccessToken(): Promise<string | null> {
  try {
    if (typeof window !== "undefined") {
      const { data } = await authClient.token();
      return data?.token ?? null;
    }
    return null;
  } catch {
    return null;
  }
}

export async function buildAuthHeaders(token?: string): Promise<HeadersInit> {
  const h: HeadersInit = {
    "Content-Type": "application/json",
    // Always include cookies so server components (RSC) forward the
    // Better Auth session cookie to the backend, which verifies it via
    // the Prisma adapter. This restores the original session-based flow
    // for public pages, dashboard pages, etc.
    credentials: "include" as const,
  };
  // If an explicit token is supplied (e.g. from getServerToken / getAccessToken),
  // add a Bearer header so the backend's JWT verification path runs.
  // This is used by /admin and /organizer protected pages when they
  // explicitly pass a token, while still also sending the cookie jar.
  if (token) {
    h.authorization = `Bearer ${token}`;
  } else if (typeof window !== "undefined") {
    // Browser-only: auto-inject the Better Auth JWT token so that
    // client‑side fetch calls (e.g. from use client components) also get
    // authenticated when no explicit token is passed.
    try {
      const { data } = await authClient.token();
      if (data?.token) {
        h.authorization = `Bearer ${data.token}`;
      }
    } catch {
      // Silently fall back – the cookie will still authenticate the user.
    }
  }
  return h;
}

// ─── Events ────────────────────────────────────────────────────────────────

export const getEvents = async (idOrSlug?: string, token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/events${idOrSlug ? `/${encodeURIComponent(idOrSlug)}` : ""}`, {
      headers,
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch events:", error);
    throw error;
  }
};

export const getEvent = async (idOrSlug: string, token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/events/${encodeURIComponent(idOrSlug)}`, {
      headers,
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch event:", error);
    throw error;
  }
};

export const createEvent = async (data: Record<string, unknown>, token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to create event:", error);
    throw error;
  }
};

export const updateEvent = async (eventId: string, data: Record<string, unknown>, token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/events/${encodeURIComponent(eventId)}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to update event:", error);
    throw error;
  }
};

export const createTier = async (eventId: string, data: { name: string; price: number; perks?: string }, token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/events/${encodeURIComponent(eventId)}/tiers`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to create tier:", error);
    throw error;
  }
};

export const createScheduleItem = async (
  eventId: string,
  data: { time: string; title: string; speaker?: string },
  token?: string
) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/events/${encodeURIComponent(eventId)}/schedule`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to create schedule item:", error);
    throw error;
  }
};

// ─── Categories ────────────────────────────────────────────────────────────

export const getCategories = async (token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/categories`, {
      headers,
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw error;
  }
};

// ─── Orders ────────────────────────────────────────────────────────────────

export const createOrder = async (
  data: { eventId: string; quantity: number; tierId?: string; attendeeName?: string },
  token?: string
) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to create order:", error);
    throw error;
  }
};

export const getMyOrders = async (token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/orders`, {
      headers,
      cache: "no-store",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch orders:", error);
    throw error;
  }
};

export const getOrganizerOrders = async (token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/orders/organizer`, {
      headers,
      cache: "no-store",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch organizer orders:", error);
    throw error;
  }
};

// ─── Tickets ───────────────────────────────────────────────────────────────

export const getMyTickets = async (token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/tickets`, {
      headers,
      cache: "no-store",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch tickets:", error);
    throw error;
  }
};

// ─── Reviews ───────────────────────────────────────────────────────────────

export const getEventReviews = async (eventId: string, token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/reviews/event/${encodeURIComponent(eventId)}`, {
      headers,
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch reviews:", error);
    throw error;
  }
};

export const createReview = async (data: { eventId: string; rating: number; comment?: string }, token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to create review:", error);
    throw error;
  }
};

// ─── User ──────────────────────────────────────────────────────────────────

export const getUser = async (id: string, token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/users/${encodeURIComponent(id)}`, {
      headers,
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch user:", error);
    throw error;
  }
};

export const updateUser = async (id: string, data: Record<string, unknown>, token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/users/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers,
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to update user:", error);
    throw error;
  }
};

export const updateUserRole = async (id: string, role: string, token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/users/${encodeURIComponent(id)}/role`, {
      method: "PATCH",
      headers,
      body: JSON.stringify({ role }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to update user role:", error);
    throw error;
  }
};

// ─── Organizer ─────────────────────────────────────────────────────────────

export const getOrganizer = async (id: string, token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/organizers/${encodeURIComponent(id)}`, {
      headers,
      cache: "no-store",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch organizer:", error);
    throw error;
  }
};

export const getOrganizerStats = async (id: string, token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/organizers/${encodeURIComponent(id)}/stats`, {
      headers,
      cache: "no-store",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch organizer stats:", error);
    throw error;
  }
};

// ─── Admin ─────────────────────────────────────────────────────────────────

export const getAdminStats = async (token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/admin/stats`, {
      headers,
      cache: "no-store",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch admin stats:", error);
    throw error;
  }
};

export const getAdminUsers = async (token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/admin/users`, {
      headers,
      cache: "no-store",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch admin users:", error);
    throw error;
  }
};

export const getAdminEvents = async (token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/admin/events`, {
      headers,
      cache: "no-store",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch admin events:", error);
    throw error;
  }
};

export const getAdminOrders = async (token?: string) => {
  try {
    const headers = await buildAuthHeaders(token);
    const response = await fetch(`${API_URL}/admin/orders`, {
      headers,
      cache: "no-store",
      credentials: "include",
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message);
    }

    return result.data;
  } catch (error) {
    console.error("Failed to fetch admin orders:", error);
    throw error;
  }
};