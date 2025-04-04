/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://uddoktahut-backend.onrender.com/:path*",
      },
    ];
  },
};

export default nextConfig;
