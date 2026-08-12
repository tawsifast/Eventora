/** @type {import('next').NextConfig} */
const nextConfig: import('next').NextConfig = {
  serverExternalPackages: ["@prisma/adapter-pg", "pg", "@prisma/client"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**", // ← সব domain allow
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
  },
  async rewrites() {
    const backend = process.env.BACKEND_URL;
    if (!backend) return [];
    const prefixes = [
      "/api/events",
      "/api/categories",
      "/api/users",
      "/api/orders",
      "/api/tickets",
      "/api/reviews",
      "/api/organizers",
      "/api/admin",
    ];
    return prefixes.map((prefix) => ({
      source: `${prefix}/:path*`,
      destination: `${backend}${prefix}/:path*`,
    }));
  },
};

export default nextConfig;