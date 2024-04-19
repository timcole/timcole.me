import { FC, ReactElement } from 'react';
import Launch from './Launch';

type position = {
  company: string;
  website: string;
  role: string;
  date: string;
  description: ReactElement;
};

const Positions: FC = () => {
  const positions: position[] = [
    {
      company: 'Modest Labs LLC',
      website: 'https://modest.so',
      role: 'Founder',
      date: 'Oct 2021 - Present',
      description: (
        <>
          <p>
            Modest Labs is a development company that partners with others to
            build custom solutions for difficult problems.
          </p>
          <p>Some of our products include:</p>
          <ul className="pl-4 flex flex-col gap-2">
            <li>
              <a
                href="https://freshtok.bot"
                target="_blank"
                className="font-semibold"
              >
                FreshTok.bot
              </a>
              ;
              <p>
                Providing TikTok creators with an easy and seamless way to share
                their content cross-platform for better discoverability.
              </p>
            </li>
            <li>
              <a
                href="https://www.banner.yt"
                target="_blank"
                className="font-semibold"
              >
                banner.yt
              </a>
              ;
              <p>
                A simple utility to quickly and easily hotlink banners from any
                YouTube channels anywhere.
              </p>
            </li>
            <li>
              <a
                href="https://spaceflight.live"
                target="_blank"
                className="font-semibold"
              >
                Spaceflight Live
              </a>
              ; <Launch />
            </li>
          </ul>
          <p>
            Modest Labs operates <b>AS992</b> for all network inquiries please
            use the contact email listed on whois.
          </p>
        </>
      ),
    },
    {
      company: 'Social Blade LLC',
      website: 'https://socialblade.com',
      role: 'Engineering Lead',
      date: 'Mar 2016 - Present',
      description: (
        <>
          <p>
            Leading our engineering team working on building out our new tech
            stack and Kubernetes infrastructure. Making and implementing
            technical decisions, writing code and delegating tasks to others.
          </p>
          <p>
            Currently leading the transition of our very legacy PHP, MySQL,
            Redis infrastructure to our new upcoming Rust, tRPC, PostgreSQL,
            KeyDB, NextJS infrastructure.
          </p>
          <p>
            Our transition goal is to provide a more user-friendly and stable
            service so everyone can continue to enjoy the stats they love
            without interruption.
          </p>
        </>
      ),
    },
  ];

  return (
    <div className="container max-w-5xl">
      {positions.map(({ company, website, role, date, description }) => (
        <div key={company} className="flex flex-col gap-4 py-3">
          <div className="flex gap-0 items-start flex-col sm:flex-row sm:gap-6 sm:items-end">
            <span className="font-semibold mt-1 text-primary-50">
              {role} @{' '}
              <a
                href={website}
                target="_blank"
                className="text-cyan-300 hover:text-cyan-400"
              >
                {company}
              </a>
            </span>
            <span className="mt-1 text-primary-400">{date}</span>
          </div>
          <div className="text-gray-300 md:flex-grow flex-col gap-3 flex">
            {description}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Positions;
