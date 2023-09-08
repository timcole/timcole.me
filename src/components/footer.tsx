import { FC } from 'react';
import { twMerge } from 'tailwind-merge';

const Footer: FC = () => (
  <footer
    className={twMerge(
      'text-center text-gray-500 py-6',
      'group-[.olivia]:text-gray-100',
    )}
  >
    Copyright &copy; 1997-{new Date().getFullYear()} - Timothy Cole - All Rights
    Reserved. —{' '}
    <a
      href="https://github.com/timcole/timcole.me"
      target="_blank"
      className="border-b-2 border-dashed border-gray-600"
    >
      Star on GitHub
    </a>
  </footer>
);

export default Footer;
