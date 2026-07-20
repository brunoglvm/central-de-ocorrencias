import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  allowedDevOrigins: [
    process.env.ALLOWED_DEV_HOST,
    process.env.ALLOWED_DEV_IP,
  ].filter((origin): origin is string => Boolean(origin)),
};

export default nextConfig;
