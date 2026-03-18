import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  // We do not use next/image, so disable image optimization to eliminate
  // the GHSA-3x4c-7xq6-9pq8 unbounded disk-cache attack surface.
  images: {
    unoptimized: true,
  },
}

export default nextConfig
