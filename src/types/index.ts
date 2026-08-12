/**
 * EventHub domain types.
 *
 * These mirror the entities the future Express + Prisma + PostgreSQL backend
 * will expose, so the mock data modules in `src/data` can be swapped for REST
 * calls in `src/services` without touching the UI.
 */

export type UserRole = "user" | "organizer" | "admin";
export type UserStatus = "active" | "suspended";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl?: string;
  initials: string;
  joinedAt: string;
  bio?: string;
  city?: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  eventCount: number;
  _count?: { events?: number };
}

export type EventStatus = "upcoming" | "ongoing" | "completed" | "cancelled";

export interface ScheduleItem {
  id: string;
  time: string;
  title: string;
  speaker?: string;
}

export interface TicketTier {
  id: string;
  name: string;
  price: number;
  perks: string;
}

export interface Event {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  imageUrl: string;
  categorySlug: string;
  organizerId: string;
  organizerName: string;
  date: string; // ISO date
  startTime: string;
  endTime: string;
  venue: string;
  address: string;
  city: string;
  price: number;
  capacity: number;
  ticketsSold: number;
  status: EventStatus;
  featured: boolean;
  popularity: number;
  rating: number;
  reviewCount: number;
  schedule: ScheduleItem[];
  tiers: TicketTier[];
  category?: { slug?: string; name?: string };
  organizer?: { name?: string; id?: string };
}

export interface Review {
  id: string;
  eventId: string;
  userId: string;
  userName: string;
  userInitials: string;
  rating: number;
  comment: string;
  createdAt: string;
  user?: { name?: string };
}

export type OrderStatus = "pending" | "confirmed" | "cancelled";
export type PaymentStatus = "paid" | "unpaid" | "refunded";

export interface Order {
  id: string;
  eventId: string;
  eventTitle: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  quantity: number;
  amount: number;
  status: OrderStatus;
  paymentStatus: PaymentStatus;
  createdAt: string;
  event?: { title?: string };
}

export type TicketStatus = "valid" | "used" | "refunded";

export interface Ticket {
  id: string;
  orderId: string;
  eventId: string;
  userId: string;
  attendeeName: string;
  tierName: string;
  quantity: number;
  status: TicketStatus;
  purchasedAt: string;
  event?: Event;
}
