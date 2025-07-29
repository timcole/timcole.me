import { Age } from '@/components/age';
import { FC, Fragment } from 'react';

const socials = [
  'https://github.com/timcole',
  'https://x.com/modesttim',
  'https://instagram.com/modesttim',
  'http://discord.gg/modest',
];

const Lines: Record<string, FC> = {
  Uptime: Age,
  Location: () => 'Dallas, TX',
  'Go to Language': () => 'Rust, TypeScript',
  'Go to Editor': () => (
    <a
      href="https://github.com/timcole/dotfiles/tree/%F0%9F%A6%84/zed"
      target="_blank"
      className="italic"
    >
      Zed
    </a>
  ),
  Socials: () =>
    socials.map((l, i) => {
      const name = new URL(l);
      return (
        <Fragment key={l}>
          <a href={name.href} target="_blank" className="italic">
            {name.host.split('.')[0]}
          </a>
          {i < socials.length - 1 && ', '}
        </Fragment>
      );
    }),
};

const AboutMe: FC = () => (
  <div className="flex flex-col gap-2 whitespace-pre text-gray-300 py-2">
    <div className="flex gap-4">
      <div className="sm:flex items-center hidden">
        <img
          className="object-cover object-center w-44 h-44 rounded-md shadow-sm min-w-32"
          width={176}
          height={176}
          src="https://t.pics/me.webp"
        />
      </div>
      <div>
        <div className="flex flex-col gap-1">
          <h2>
            <span className="text-red-400">tim</span>@
            <span className="text-red-400">timcole.me</span>
          </h2>

          <p>--------------</p>

          {Object.keys(Lines).map((key) => {
            const Line = Lines[key as keyof typeof Lines];

            return (
              <p key={key} className="flex">
                <span className="text-red-400">{key}</span>:{' '}
                <span className="text-wrap" suppressHydrationWarning>
                  <Line />
                </span>
              </p>
            );
          })}
        </div>
      </div>
    </div>
  </div>
);

export default AboutMe;
