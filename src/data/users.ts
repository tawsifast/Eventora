import type { User } from "@/types";

export const currentUser: User = {
  id: "u_1",
  name: "Tawsif Rahman",
  email: "tawsif@eventhub.io",
  role: "organizer",
  status: "active",
  initials: "TR",
  joinedAt: "2025-11-04",
  bio: "Community builder hosting tech meetups across Dhaka.",
  city: "Dhaka",
};

export const users: User[] = [
  currentUser,
  {
    id: "u_2",
    name: "Nadia Karim",
    email: "nadia.karim@gmail.com",
    role: "user",
    status: "active",
    initials: "NK",
    joinedAt: "2026-01-18",
    city: "Dhaka",
  },
  {
    id: "u_3",
    name: "Imran Hossain",
    email: "imran.h@outlook.com",
    role: "user",
    status: "active",
    initials: "IH",
    joinedAt: "2026-02-02",
    city: "Chattogram",
  },
  {
    id: "u_4",
    name: "Sadia Chowdhury",
    email: "sadia@stagecraft.co",
    role: "organizer",
    status: "active",
    initials: "SC",
    joinedAt: "2025-09-22",
    city: "Sylhet",
  },
  {
    id: "u_5",
    name: "Arif Mahmud",
    email: "arif.mahmud@eventhub.io",
    role: "admin",
    status: "active",
    initials: "AM",
    joinedAt: "2025-06-11",
    city: "Dhaka",
  },
  {
    id: "u_6",
    name: "Rumana Islam",
    email: "rumana.islam@gmail.com",
    role: "user",
    status: "suspended",
    initials: "RI",
    joinedAt: "2026-03-14",
    city: "Khulna",
  },
  {
    id: "u_7",
    name: "Farhan Kabir",
    email: "farhan.kabir@gmail.com",
    role: "user",
    status: "active",
    initials: "FK",
    joinedAt: "2026-04-27",
    city: "Rajshahi",
  },
  {
    id: "u_8",
    name: "Meherun Nesa",
    email: "meherun@artsbd.org",
    role: "organizer",
    status: "active",
    initials: "MN",
    joinedAt: "2026-05-09",
    city: "Dhaka",
  },
];

export function getUser(id: string): User | undefined {
  return users.find((u) => u.id === id);
}
