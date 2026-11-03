import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  output: 'standalone',
  allowedDevOrigins: [process.env.ALLOWED_DEV_HOST, process.env.ALLOWED_DEV_IP].filter((origin): origin is string =>
    Boolean(origin),
  ),
  turbopack: {
    root: process.cwd(),
  },
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '9000',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '9000',
      },
      {
        protocol: 'http',
        hostname: '192.168.0.128',
        port: '9000',
      },
    ],
  },
}

export default nextConfig
