import './globals.css';
import type { Metadata } from 'next';
import { JetBrains_Mono } from 'next/font/google';
import { twMerge } from 'tailwind-merge';
import Footer from '@/components/footer';

const mono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
});

export const viewport = {
  width: 'device-width',
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL('https://timcole.me'),
  title: 'Timothy Cole',
  description: 'Timothy Cole - Software Engineer',
  authors: [{ name: 'Timothy Cole' }],
  twitter: {
    creator: '@ModestTim',
    site: '@ModestTim',
  },
  keywords: [
    'Software Engineer',
    'Full Stack Developer',
    'Web Developer',
    'Programmer',
    'Network Admin',
    'FreshTok',
    'Modest Labs',
  ],
  icons: [
    {
      rel: 'icon',
      href: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦄</text></svg>',
      url: 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🦄</text></svg>',
    },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full font-mono" data-artist="">
      <link rel="dns-prefetch" href="i.scdn.co" />
      <link rel="dns-prefetch" href="t.pics" />
      <link rel="dns-prefetch" href="booster.spaceflight.live" />
      <link rel="dns-prefetch" href="api.lanyard.rest" />
      <link rel="preload" href="https://t.pics/me.webp" as="image" />
      <body
        className={twMerge(
          mono.className,
          'h-full flex flex-col bg-primary-950',
        )}
      >
        {children}
        <Footer />
      </body>
    </html>
  );
}
