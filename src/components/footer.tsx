import { FC } from 'react';

const Footer: FC = () => (
  <footer className="bg-primary-800 text-gray-500 px-3 my-2 flex">
    <div className="shrink px-2 flex gap-4">
      <a
        href="https://github.com/timcole/timcole.me"
        target="_blank"
        className="italic bg-teal-400 text-primary-950 px-2"
      >
        Star on GitHub
      </a>
      Copyright &copy; 1997-{new Date().getFullYear()} - MIT License
    </div>
  </footer>
);

export default Footer;
