import Lanyard from '@/components/Lanyard';
import './globals.css';
import type { Metadata } from 'next';
import { PT_Sans } from 'next/font/google';
import { twMerge } from 'tailwind-merge';

const ptsans = PT_Sans({
  subsets: ['latin'],
  weight: ['400'],
  style: ['normal', 'italic'],
});

export const metadata: Metadata = {
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
  viewport: { width: 'device-width', initialScale: 1 },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-primary-200 dark:bg-primary-800">
      <body className={twMerge(ptsans.className, 'h-full')}>
        {children}
        <Lanyard />
      </body>
    </html>
  );
}
