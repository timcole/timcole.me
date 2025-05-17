/**
 * @type {import('next').NextConfig}
 */
export default {
  output: 'standalone',
  experimental: {
    reactCompiler: true,
    viewTransition: true,
  },
  images: { domains: ['t.pics'] },
};
