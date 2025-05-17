/**
 * @type {import('next').NextConfig}
 */
export default {
  output: 'standalone',
  experimental: {
    reactCompiler: true,
    viewTransition: true,
  },
  images: {
    domains: ['t.pics'],
    minimumCacheTTL: 2678400, // 31 days
  },
};
