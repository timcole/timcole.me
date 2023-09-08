import { FC } from 'react';
import Launch from '@/components/Launch';
import { twMerge } from 'tailwind-merge';

const AboutMe: FC = () => (
  <div className="container mx-auto p-4 sm:p-12">
    <div
      className={twMerge(
        'items-center p-8 rounded-lg shadow-md lg:flex bg-primary-700',
        'group-[.olivia]:bg-olivia-500',
      )}
    >
      <div className="lg:w-3/4">
        <h2 className="text-3xl font-bold text-primary-100">Timothy Cole</h2>

        <p className="mt-4 text-primary-300">
          A 26 year old, self-taught, software engineer from Raleigh, NC.
        </p>

        <p className="mt-4 text-primary-300">
          I prefer to write back-end code (Rust, TypeScript, Go), but do
          front-end as needed (React/NextJS TypeScript).
        </p>
        <p className="mt-4 text-primary-300">
          NeoVim is my editor of choice.{' '}
          <a
            href="https://github.com/timcole/dotfiles"
            target="_blank"
            className="border-b-2 border-double"
          >
            dotfiles
          </a>
        </p>

        <div className="flex items-center mt-4 -mx-2 flex-col md:flex-row">
          <a
            className="m-2 shadow"
            href="https://twitter.com/modesttim"
            target="_blank"
            aria-label="Twitter"
          >
            <img
              className="min-h-[20px]"
              src="https://img.shields.io/twitter/follow/ModestTim?color=00acee&label=@ModestTim&logo=twitter&logoColor=fff&style=flat-square"
              alt="Link to Twitter"
            />
          </a>

          <a
            className="m-2 shadow"
            href="https://fosstodon.org/@modesttim"
            target="_blank"
            aria-label="Mastodon"
            rel="me"
          >
            <img
              className="min-h-[20px]"
              src="https://img.shields.io/mastodon/follow/109536545701324051?color=%235c4fe6&domain=https%3A%2F%2Ffosstodon.org&label=%40ModestTim&logo=mastodon&logoColor=fff&style=flat-square"
              alt="Link to Mastodon"
            />
          </a>

          <a
            className="m-2 shadow"
            href="https://github.com/timcole"
            target="_blank"
            aria-label="Github"
          >
            <img
              className="min-h-[20px]"
              src="https://img.shields.io/github/followers/timcole?color=161b22&label=Github&logo=github&logoColor=fff&style=flat-square"
              alt="Link to Github"
            />
          </a>

          <a
            className="m-2 shadow"
            href="https://discord.gg/modest"
            target="_blank"
            aria-label="Discord"
          >
            <img
              className="min-h-[20px]"
              src="https://img.shields.io/discord/313591755180081153?color=5865F2&label=Modest%20Labs%20Discord&logo=discord&logoColor=fff&style=flat-square"
              alt="Link to Discord"
            />
          </a>
        </div>
      </div>

      <div className="mt-8 lg:mt-0 lg:w-1/2">
        <div className="flex items-center justify-center lg:justify-end">
          <div className="max-w-lg">
            <img
              className="object-cover object-center w-auto h-64 rounded-md shadow"
              src="https://tim.rip/me.jpg"
              alt="Picture of me"
            />
          </div>
        </div>
      </div>
    </div>
    <Launch />
  </div>
);

export default AboutMe;
