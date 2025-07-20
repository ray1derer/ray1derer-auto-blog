import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  
  // SEO 최적화를 위한 설정
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  
  // 메타데이터 설정
  async headers() {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN'
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'no-store, max-age=0',
          },
        ],
      },
    ]
  },
  
  // 리다이렉트 설정
  async redirects() {
    return [
      {
        source: '/sitemap.xml',
        destination: '/sitemap',
        permanent: true,
      },
    ]
  },
  
  // 실험적 기능 활성화
  experimental: {
    // Next.js 15의 새로운 기능들
    optimizeCss: true,
  },
  
  // 압축 활성화
  compress: true,
  
  // 파워드바이 헤더 제거
  poweredByHeader: false,
  
  // 트레일링 슬래시 설정
  trailingSlash: false,
  
  // 리액트 strict 모드
  reactStrictMode: true,
};

export default nextConfig;
