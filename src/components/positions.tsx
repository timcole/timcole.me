import { FC, ReactElement } from 'react';
import { twMerge } from 'tailwind-merge';

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
      role: 'Founder CEO',
      date: 'Oct 2021 - Present',
      description: (
        <>
          <p>
            Modest Labs is a development company that partners with others to
            build custom solutions for difficult problems.
          </p>
          <p>
            Our main product is a service in collaboration with ByteDance called{' '}
            <a
              href="https://freshtok.bot"
              target="_blank"
              className="font-semibold"
            >
              FreshTok
            </a>
            . Providing TikTok creators with an easy and seamless way to share
            their content cross-platform for better discoverability.
          </p>
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
            Cassandra, Redis, NextJS infrastructure.
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
    <div className="container px-6 sm:px-12 py-6 mx-auto flex-1">
      <div
        className={twMerge(
          '-my-8 divide-y-2 divide-primary-700',
          'group-data-olivia:divide-transparent group-data-taylor:divide-transparent',
        )}
      >
        {positions.map(({ company, website, role, date, description }) => (
          <div
            key={company}
            className={twMerge(
              'py-8 px-4 flex flex-wrap md:flex-nowrap rounded-lg',
              'group-data-olivia:bg-olivia-300 group-data-olivia:py-6 group-data-olivia:my-2',
              'group-data-taylor:bg-taylor-100 group-data-taylor:py-6 group-data-taylor:my-2',
            )}
          >
            <div className="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
              <h2
                className={twMerge(
                  'text-xl font-bold text-primary-200',
                  'group-data-taylor:text-taylor-900',
                )}
              >
                <a href={website} target="_blank" className="underline">
                  {company}
                </a>
              </h2>
              <span
                className={twMerge(
                  'font-semibold mt-1 text-primary-300',
                  'group-data-taylor:text-taylor-900/90',
                )}
              >
                {role}
              </span>
              <span
                className={twMerge(
                  'mt-1 text-primary-400 text-sm',
                  'group-data-taylor:text-taylor-900/50',
                )}
              >
                {date}
              </span>
            </div>
            <div
              className={twMerge(
                'text-gray-300 md:flex-grow flex-col gap-3 flex',
                'group-data-olivia:text-sm group-data-olivia:leading-6',
                'group-data-taylor:text-sm group-data-taylor:leading-6 group-data-taylor:text-taylor-900',
              )}
            >
              {description}
            </div>
          </div>
        ))}
      </div>
      <div className="text-center py-12">
        <a
          className={twMerge(
            'shadow border border-gray-700 bg-gray-700 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-gray-800 focus:ring-2 ring-blue-700',
            'group-data-olivia:bg-olivia-500 group-data-olivia:border-olivia-300 hover:group-data-olivia:bg-olivia-300',
          )}
          href="https://www.linkedin.com/in/modesttim/"
          target="_blank"
        >
          Past Experiences
        </a>
      </div>
    </div>
  );
};

export default Positions;
