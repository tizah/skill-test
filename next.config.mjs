/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    basicAuth: process.env.BASIC_AUTH_USERNAME,
    basicPassword: process.env.BASIC_AUTH_PASSWORD,
  },
  reactStrictMode: true,
  images: {
    domains: ["fedskillstest.ct.digital"],
  },
};

export default nextConfig;
