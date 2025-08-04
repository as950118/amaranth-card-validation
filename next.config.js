/** @type {import('next').NextConfig} */
const nextConfig = {
  // SVG 최적화 설정
  webpack: (config) => {
    // SVG 파일을 React 컴포넌트로 처리
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack'],
    });
    
    return config;
  },
  
  // 이미지 최적화 설정
  images: {
    formats: ['image/webp', 'image/avif'],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  
  // 압축 설정
  compress: true,
  
  // 캐시 설정
  generateEtags: false,
}

module.exports = nextConfig 