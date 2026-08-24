
import { PrismaPg } from "@prisma/adapter-pg";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { jwt } from "better-auth/plugins";
import { PrismaClient } from "./generated/prisma/client";

// If your Prisma file is located elsewhere, you can change the path


const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL! }),
});
export const auth = betterAuth({
  baseURL: process.env.BETTER_AUTH_URL, // http://localhost:3000
  secret: process.env.BETTER_AUTH_SECRET,
  database: prismaAdapter(prisma, {
    provider: "postgresql", // or "mysql", "postgresql", ...etc
  }),
  emailAndPassword: {
    enabled: true,
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "user",
        input: true,
      },
    },
  },
  plugins: [
    jwt({
      jwt: {
        definePayload: (session) => ({
          id: session.user.id,
          email: session.user.email,
          role: (session.user as any).role ?? "user",
        }),
      },
    }),
  ],
  session: {
    cookieCache :{
      enabled: true,
      strategy: "jwt",
      maxAge: 60 * 24 * 30
    }
  },
});