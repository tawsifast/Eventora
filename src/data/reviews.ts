import type { Review } from "@/types";

export const reviews: Review[] = [
  {
    id: "r_1",
    eventId: "e_cricket_cup",
    userId: "u_2",
    userName: "Nadia Karim",
    userInitials: "NK",
    rating: 5,
    comment:
      "Entry was quick, the fan zone kept the kids busy for an hour and the final went to the last over. Worth every taka.",
    createdAt: "2026-07-19T08:12:00Z",
  },
  {
    id: "r_2",
    eventId: "e_cricket_cup",
    userId: "u_3",
    userName: "Imran Hossain",
    userInitials: "IH",
    rating: 4,
    comment: "Great atmosphere, though the food stalls ran out of options by the second innings.",
    createdAt: "2026-07-19T14:40:00Z",
  },
  {
    id: "r_3",
    eventId: "e_design_lecture",
    userId: "u_7",
    userName: "Farhan Kabir",
    userInitials: "FK",
    rating: 5,
    comment: "The critique session alone was worth attending. Notes I'm still using at work.",
    createdAt: "2026-07-03T10:02:00Z",
  },
  {
    id: "r_4",
    eventId: "e_food_carnival",
    userId: "u_6",
    userName: "Rumana Islam",
    userInitials: "RI",
    rating: 4,
    comment: "Heritage walk was the highlight. Bring cash for the smaller kitchens.",
    createdAt: "2026-08-17T06:30:00Z",
  },
  {
    id: "r_5",
    eventId: "e_tech_summit",
    userId: "u_3",
    userName: "Imran Hossain",
    userInitials: "IH",
    rating: 5,
    comment: "Last year's edition got me my current job. Registered again the day tickets opened.",
    createdAt: "2026-06-28T17:11:00Z",
  },
  {
    id: "r_6",
    eventId: "e_music_festival",
    userId: "u_2",
    userName: "Nadia Karim",
    userInitials: "NK",
    rating: 5,
    comment: "The acoustic tent by the water at sunset is one of the best things happening in the country.",
    createdAt: "2026-06-11T19:45:00Z",
  },
  {
    id: "r_7",
    eventId: "e_marketing_workshop",
    userId: "u_7",
    userName: "Farhan Kabir",
    userInitials: "FK",
    rating: 3,
    comment: "Solid content but the room ran twenty minutes behind all day.",
    createdAt: "2026-05-30T12:00:00Z",
  },
];

export function getReviewsByEvent(eventId: string): Review[] {
  return reviews.filter((r) => r.eventId === eventId);
}

export function getReviewsByUser(userId: string): Review[] {
  return reviews.filter((r) => r.userId === userId);
}

export function getRatingDistribution(list: Review[]): Record<number, number> {
  const dist: Record<number, number> = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
  for (const r of list) dist[r.rating] = (dist[r.rating] ?? 0) + 1;
  return dist;
}

export function getAverageRating(list: Review[]): number {
  if (list.length === 0) return 0;
  return list.reduce((sum, r) => sum + r.rating, 0) / list.length;
}
