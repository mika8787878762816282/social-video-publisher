/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
    TIKTOK_CLIENT_ID: process.env.TIKTOK_CLIENT_ID,
  },
};

module.exports = nextConfig;
