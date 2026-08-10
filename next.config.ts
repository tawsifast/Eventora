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
};

export default nextConfig;