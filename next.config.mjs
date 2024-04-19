/**
 * @type {import('next').NextConfig}
 */
export default {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'tim.rip',
        port: '',
      },
    ],
  },
};
