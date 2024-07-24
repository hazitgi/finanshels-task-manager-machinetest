/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_SOCKET_URL: process.env.NEXT_SOCKET_URL,
  },
};

export default nextConfig;
