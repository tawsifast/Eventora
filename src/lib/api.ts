/**
 * Small fetch helper for the Eventora backend API (http://localhost:5000/api).
 *
 * All requests send the Better Auth session cookie (`credentials: "include"`)
 * so the backend knows which user is logged in. Response data is mapped into
 * the EventHub domain types from `src/types` so components never change.
 */
/* eslint-disable @typescript-eslint/no-explicit-any */

import type {
  Category,
  Event,
  Order,
  Review,
  ScheduleItem,
  Ticket,
  TicketTier,
  User,
} from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000/api";

export class ApiError extends Error {}

async function api<T>(path: string, options: RequestInit = {}, cookie?: string): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(cookie ? { cookie } : {}),
        ...options.headers,
      },
      credentials: "include",
      cache: "no-store",
    });
  } catch {
    throw new ApiError("Cannot reach the server. Is the backend running?");
  }

  let body: { success: boolean; message?: string; data?: T };
  try {
    body = await res.json();
  } catch {
    throw new ApiError(`Server returned an unexpected response (${res.status})`);
  }

  if (!res.ok || !body.success) {
    throw new ApiError(body.message ?? "Something went wrong");
  }

  return body.data as T;
}

// ─── Mappers: API rows → EventHub domain types ────────────────────────────

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  const first = parts[0]?.[0] ?? "";
  const last = parts[1]?.[0] ?? "";
  return (first + last).toUpperCase() || "U";
}

function mapUser(raw: any): User {
  return {
    id: raw.id,
    name: raw.name,
    email: raw.email,
    role: raw.role,
    status: String(raw.status ?? "ACTIVE").toLowerCase() as User["status"],
    avatarUrl: raw.image ?? undefined,
    initials: initials(raw.name),
    joinedAt: raw.createdAt ? String(raw.createdAt).slice(0, 10) : "",
    bio: raw.bio ?? undefined,
    city: raw.city ?? undefined,
  };
}

function mapCategory(raw: any): Category {
  return {
    id: raw.id,
    slug: raw.slug,
    name: raw.name,
    description: raw.description ?? "",
    icon: raw.icon ?? "Cpu",
    eventCount: raw._count?.events ?? 0,
  };
}

function mapScheduleItem(raw: any): ScheduleItem {
  return {
    id: raw.id,
    time: raw.time,
    title: raw.title,
    speaker: raw.speaker ?? undefined,
  };
}

function mapTicketTier(raw: any): TicketTier {
  return {
    id: raw.id,
    name: raw.name,
    price: raw.price,
    perks: raw.perks ?? "",
  };
}

function mapEvent(raw: any): Event {
  return {
    id: raw.id,
    slug: raw.slug,
    title: raw.title,
    shortDescription: raw.shortDescription ?? "",
    description: raw.description,
    imageUrl: raw.imageUrl ?? "",
    categorySlug: raw.category?.slug ?? "general",
    organizerId: raw.organizerId,
    organizerName: raw.organizer?.name ?? "Organizer",
    date: raw.date,
    startTime: raw.startTime,
    endTime: raw.endTime,
    venue: raw.venue,
    address: raw.address ?? "",
    city: raw.city,
    price: raw.price,
    capacity: raw.capacity,
    ticketsSold: raw.ticketsSold,
    status: String(raw.status ?? "UPCOMING").toLowerCase() as Event["status"],
    featured: raw.featured,
    popularity: raw.popularity,
    rating: raw.rating,
    reviewCount: raw.reviewCount,
    schedule: (raw.schedule ?? []).map(mapScheduleItem),
    tiers: (raw.tiers ?? []).map(mapTicketTier),
  };
}

function mapOrder(raw: any): Order {
  return {
    id: raw.id,
    eventId: raw.eventId,
    eventTitle: raw.event?.title ?? "Event",
    customerId: raw.customerId,
    customerName: raw.customerName,
    customerEmail: raw.customerEmail,
    quantity: raw.quantity,
    amount: raw.amount,
    status: String(raw.status ?? "PENDING").toLowerCase() as Order["status"],
    paymentStatus: String(raw.paymentStatus ?? "UNPAID").toLowerCase() as Order["paymentStatus"],
    createdAt: raw.createdAt,
  };
}

function mapTicket(raw: any): Ticket {
  const status = String(raw.status ?? "ACTIVE").toUpperCase();
  return {
    id: raw.id,
    orderId: raw.orderId,
    eventId: raw.eventId,
    userId: raw.userId,
    attendeeName: raw.attendeeName,
    tierName: raw.tierName,
    quantity: raw.quantity,
    status:
      status === "ACTIVE"
        ? "valid"
        : status === "USED"
          ? "used"
          : "refunded",
    purchasedAt: raw.purchasedAt,
    ...(raw.event ? { event: mapEvent(raw.event) } : {}),
  };
}

function mapReview(raw: any): Review {
  const name = raw.user?.name ?? "Attendee";
  return {
    id: raw.id,
    eventId: raw.eventId,
    userId: raw.userId,
    userName: name,
    userInitials: initials(name),
    rating: raw.rating,
    comment: raw.comment ?? "",
    createdAt: raw.createdAt,
  };
}

// ─── Public data (no auth needed) ──────────────────────────────────────────

export async function getEvents(cookie?: string): Promise<Event[]> {
  return (await api<any[]>("/events", {}, cookie)).map(mapEvent);
}

export async function getEvent(idOrSlug: string, cookie?: string): Promise<Event> {
  return mapEvent(await api<any>(`/events/${encodeURIComponent(idOrSlug)}`, {}, cookie));
}

export async function getCategories(cookie?: string): Promise<Category[]> {
  return (await api<any[]>("/categories", {}, cookie)).map(mapCategory);
}

export async function getOrganizer(id: string, cookie?: string): Promise<{ organizer: User; events: Event[] }> {
  const raw = await api<any>(`/organizers/${encodeURIComponent(id)}`, {}, cookie);
  return { organizer: mapUser(raw.organizer), events: raw.events.map(mapEvent) };
}

export async function getOrganizerStats(
  id: string,
  cookie?: string
): Promise<{ totalEvents: number; totalOrders: number; totalTicketsSold: number; totalRevenue: number }> {
  return await api<any>(`/organizers/${encodeURIComponent(id)}/stats`, {}, cookie);
}

// ─── Authenticated user data (session cookie is sent automatically) ───────

export async function updateUser(id: string, data: Record<string, unknown>, cookie?: string): Promise<User> {
  return mapUser(await api<any>(`/users/${encodeURIComponent(id)}`, { method: "PATCH", body: JSON.stringify(data) }, cookie));
}

export async function updateUserRole(id: string, role: User["role"], cookie?: string): Promise<User> {
  return mapUser(
    await api<any>(`/users/${encodeURIComponent(id)}/role`, { method: "PATCH", body: JSON.stringify({ role }) }, cookie),
  );
}

export async function getMyOrders(cookie?: string): Promise<Order[]> {
  return (await api<any[]>("/orders", {}, cookie)).map(mapOrder);
}

export async function getOrganizerOrders(cookie?: string): Promise<Order[]> {
  return (await api<any[]>("/orders/organizer", {}, cookie)).map(mapOrder);
}

export async function getMyTickets(cookie?: string): Promise<Ticket[]> {
  return (await api<any[]>("/tickets", {}, cookie)).map(mapTicket);
}

export async function createOrder(
  data: { eventId: string; quantity: number; tierId?: string; attendeeName?: string },
  cookie?: string
): Promise<{ order: Order; ticket: Ticket }> {
  const raw = await api<any>("/orders", { method: "POST", body: JSON.stringify(data) }, cookie);
  return { order: mapOrder(raw.order), ticket: mapTicket(raw.ticket) };
}

export async function createEvent(
  data: Record<string, unknown>,
  cookie?: string
): Promise<Event> {
  return mapEvent(await api<any>("/events", { method: "POST", body: JSON.stringify(data) }, cookie));
}

export async function createTier(
  eventId: string,
  data: { name: string; price: number; perks?: string },
  cookie?: string
): Promise<TicketTier> {
  return mapTicketTier(await api<any>(`/events/${encodeURIComponent(eventId)}/tiers`, { method: "POST", body: JSON.stringify(data) }, cookie));
}

export async function createScheduleItem(
  eventId: string,
  data: { time: string; title: string; speaker?: string },
  cookie?: string
): Promise<ScheduleItem> {
  return mapScheduleItem(await api<any>(`/events/${encodeURIComponent(eventId)}/schedule`, { method: "POST", body: JSON.stringify(data) }, cookie));
}

export async function createReview(
  data: { eventId: string; rating: number; comment?: string },
  cookie?: string
): Promise<Review> {
  return mapReview(await api<any>("/reviews", { method: "POST", body: JSON.stringify(data) }, cookie));
}

export async function getEventReviews(eventId: string, cookie?: string): Promise<Review[]> {
  return (await api<any[]>(`/reviews/event/${encodeURIComponent(eventId)}`, {}, cookie)).map(mapReview);
}

// ─── Admin (backend enforces the admin role) ───────────────────────────────

export async function getAdminStats(
  cookie?: string
): Promise<{
  totalUsers: number;
  totalOrganizers: number;
  totalEvents: number;
  totalOrders: number;
  totalTickets: number;
  totalTicketsSold: number;
  totalRevenue: number;
}> {
  return await api<any>("/admin/stats", {}, cookie);
}

export async function getAdminUsers(cookie?: string): Promise<User[]> {
  return (await api<any[]>("/admin/users", {}, cookie)).map(mapUser);
}

export async function getAdminEvents(cookie?: string): Promise<Event[]> {
  return (await api<any[]>("/admin/events", {}, cookie)).map(mapEvent);
}

export async function getAdminOrders(cookie?: string): Promise<Order[]> {
  return (await api<any[]>("/admin/orders", {}, cookie)).map(mapOrder);
}
