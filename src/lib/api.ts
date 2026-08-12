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
 * `NEXT_PUBLIC_API_URL` points to the backend in development
 * (http://localhost:5000/api) and is empty in production, where Next.js
 * proxies /api routes to the backend so the session cookie stays same-origin.
 *
 * Server components pass the session cookie as the optional `cookie` argument
 * (e.g. `getMyOrders(cookie)`), so the backend knows who is making the request.
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

// ─── Events ────────────────────────────────────────────────────────────────

export const getEvents = async (cookie?: string) => {
  try {
    const response = await fetch(`${API_URL}/events`, {
      ...(cookie ? { headers: { cookie } } : {}),
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

export const getEvent = async (idOrSlug: string, cookie?: string) => {
  try {
    const response = await fetch(`${API_URL}/events/${encodeURIComponent(idOrSlug)}`, {
      ...(cookie ? { headers: { cookie } } : {}),
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

export const createEvent = async (data: Record<string, unknown>) => {
  try {
    const response = await fetch(`${API_URL}/events`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
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

export const updateEvent = async (eventId: string, data: Record<string, unknown>, cookie?: string) => {
  try {
    const response = await fetch(`${API_URL}/events/${encodeURIComponent(eventId)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify(data),
      credentials: "include",
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

export const createTier = async (eventId: string, data: { name: string; price: number; perks?: string }) => {
  try {
    const response = await fetch(`${API_URL}/events/${encodeURIComponent(eventId)}/tiers`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
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
  data: { time: string; title: string; speaker?: string }
) => {
  try {
    const response = await fetch(`${API_URL}/events/${encodeURIComponent(eventId)}/schedule`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
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

export const getCategories = async (cookie?: string) => {
  try {
    const response = await fetch(`${API_URL}/categories`, {
      ...(cookie ? { headers: { cookie } } : {}),
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

export const createOrder = async (data: { eventId: string; quantity: number; tierId?: string; attendeeName?: string }) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
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

export const getMyOrders = async (cookie?: string) => {
  try {
    const response = await fetch(`${API_URL}/orders`, {
      ...(cookie ? { headers: { cookie } } : {}),
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

export const getOrganizerOrders = async (cookie?: string) => {
  try {
    const response = await fetch(`${API_URL}/orders/organizer`, {
      ...(cookie ? { headers: { cookie } } : {}),
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

export const getMyTickets = async (cookie?: string) => {
  try {
    const response = await fetch(`${API_URL}/tickets`, {
      ...(cookie ? { headers: { cookie } } : {}),
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

export const getEventReviews = async (eventId: string, cookie?: string) => {
  try {
    const response = await fetch(`${API_URL}/reviews/event/${encodeURIComponent(eventId)}`, {
      ...(cookie ? { headers: { cookie } } : {}),
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

export const createReview = async (data: { eventId: string; rating: number; comment?: string }) => {
  try {
    const response = await fetch(`${API_URL}/reviews`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
      credentials: "include",
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

export const getUser = async (id: string, cookie?: string) => {
  try {
    const response = await fetch(`${API_URL}/users/${encodeURIComponent(id)}`, {
      ...(cookie ? { headers: { cookie } } : {}),
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

export const updateUser = async (id: string, data: Record<string, unknown>, cookie?: string) => {
  try {
    const response = await fetch(`${API_URL}/users/${encodeURIComponent(id)}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify(data),
      credentials: "include",
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

export const updateUserRole = async (id: string, role: string, cookie?: string) => {
  try {
    const response = await fetch(`${API_URL}/users/${encodeURIComponent(id)}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify({ role }),
      credentials: "include",
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

export const getOrganizer = async (id: string, cookie?: string) => {
  try {
    const response = await fetch(`${API_URL}/organizers/${encodeURIComponent(id)}`, {
      ...(cookie ? { headers: { cookie } } : {}),
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

export const getOrganizerStats = async (id: string, cookie?: string) => {
  try {
    const response = await fetch(`${API_URL}/organizers/${encodeURIComponent(id)}/stats`, {
      ...(cookie ? { headers: { cookie } } : {}),
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

export const getAdminStats = async (cookie?: string) => {
  try {
    const response = await fetch(`${API_URL}/admin/stats`, {
      ...(cookie ? { headers: { cookie } } : {}),
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

export const getAdminUsers = async (cookie?: string) => {
  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      ...(cookie ? { headers: { cookie } } : {}),
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

export const getAdminEvents = async (cookie?: string) => {
  try {
    const response = await fetch(`${API_URL}/admin/events`, {
      ...(cookie ? { headers: { cookie } } : {}),
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

export const getAdminOrders = async (cookie?: string) => {
  try {
    const response = await fetch(`${API_URL}/admin/orders`, {
      ...(cookie ? { headers: { cookie } } : {}),
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