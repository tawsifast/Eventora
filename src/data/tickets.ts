import type { Ticket } from "@/types";

export const tickets: Ticket[] = [
  {
    id: "TKT-90124",
    orderId: "EH-24081",
    eventId: "e_tech_summit",
    userId: "u_1",
    attendeeName: "Tawsif Rahman",
    tierName: "General Admission",
    quantity: 2,
    status: "valid",
    purchasedAt: "2026-08-02T10:24:00Z",
  },
  {
    id: "TKT-90119",
    orderId: "EH-24079",
    eventId: "e_music_festival",
    userId: "u_1",
    attendeeName: "Tawsif Rahman",
    tierName: "Group of 4",
    quantity: 4,
    status: "valid",
    purchasedAt: "2026-07-29T18:02:00Z",
  },
  {
    id: "TKT-90112",
    orderId: "EH-24076",
    eventId: "e_ai_conference",
    userId: "u_1",
    attendeeName: "Tawsif Rahman",
    tierName: "VIP",
    quantity: 1,
    status: "valid",
    purchasedAt: "2026-08-06T09:15:00Z",
  },
  {
    id: "TKT-90098",
    orderId: "EH-24070",
    eventId: "e_cricket_cup",
    userId: "u_1",
    attendeeName: "Tawsif Rahman",
    tierName: "General Admission",
    quantity: 3,
    status: "used",
    purchasedAt: "2026-07-10T12:45:00Z",
  },
  {
    id: "TKT-90081",
    orderId: "EH-24064",
    eventId: "e_design_lecture",
    userId: "u_1",
    attendeeName: "Tawsif Rahman",
    tierName: "General Admission",
    quantity: 1,
    status: "refunded",
    purchasedAt: "2026-06-24T15:30:00Z",
  },
];

export function getTicketsByUser(userId: string): Ticket[] {
  return tickets.filter((t) => t.userId === userId);
}

export function getTicket(id: string): Ticket | undefined {
  return tickets.find((t) => t.id === id);
}
