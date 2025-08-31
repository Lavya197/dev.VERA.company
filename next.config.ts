/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Disable ESLint check on build
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ Disable TypeScript errors on build
  },
};

export default nextConfig;
