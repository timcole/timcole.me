import type { JSX } from "preact";

type position = {
  company: string;
  website: string;
  role: string;
  date: string;
  description: JSX.Element;
};

const Positions = () => {
  const positions: position[] = [
    {
      company: "Modest Labs LLC",
      website: "https://modest.so",
      role: "Founder CEO",
      date: "Oct 2021 - Present",
      description: (
        <div class="md:flex-grow">
          <p class="text-primary-600 dark:text-primary-400">
            Modest Labs is a development company that partners with others to
            build custom solutions for difficult problems.
          </p>
          <p class="mt-4 text-primary-600 dark:text-primary-400">
            Our main product is a service in collaboration with ByteDance called
            {" "}
            <a
              href="https://freshtok.bot"
              target="_blank"
              class="font-semibold"
            >
              FreshTok
            </a>. Providing TikTok creators with an easy and seamless way to
            share their content cross-platform for better discoverability.
          </p>
          <p class="mt-4 text-primary-500 dark:text-primary-400 font-italic">
            Modest Labs operates <b>AS992</b>{" "}
            for all network inquires please use the contact email listed on
            whois.
          </p>
        </div>
      ),
    },
    {
      company: "Social Blade LLC",
      website: "https://socialblade.com",
      role: "Engineering Lead",
      date: "Mar 2016 - Present",
      description: (
        <div class="md:flex-grow">
          <p class="text-primary-600 dark:text-primary-400">
            Leading our engineering team working on building out our new tech
            stack and Kubernetes infrastructure. Making and implementing
            technical decisions, writing code and delegating tasks to others.
          </p>
          <p class="mt-4 text-primary-600 dark:text-primary-400">
            Currently leading the transition of our very legacy PHP, MySQL,
            Redis infrastructure to our new upcoming Rust, tRPC, PostgreSQL,
            Cassandra, Redis, NextJS infrastructure.
          </p>
          <p class="mt-4 text-primary-600 dark:text-primary-400">
            Our transition goal is to provide a more user-friendly and stable
            service so everyone can continue to enjoy the stats they love
            without interruption.
          </p>
        </div>
      ),
    },
  ];

  return (
    <div class="container px-6 sm:px-24 py-6 mx-auto flex-1">
      <div class="-my-8 divide-y-2 divide-primary-400 dark:divide-primary-700">
        {positions.map(({ company, website, role, date, description }) => (
          <div class="py-8 flex flex-wrap md:flex-nowrap">
            <div class="md:w-64 md:mb-0 mb-6 flex-shrink-0 flex flex-col">
              <h2 class="text-xl font-bold text-primary-700 dark:text-primary-200">
                <a href={website} target="_blank" class="underline">
                  {company}
                </a>
              </h2>
              <span class="font-semibold mt-1 text-primary-600 dark:text-primary-400">
                {role}
              </span>
              <span class="mt-1 text-primary-500 text-sm">
                {date}
              </span>
            </div>
            {description}
          </div>
        ))}
      </div>
      <div class="text-center py-12">
        <a
          class="shadow border border-primary-700 bg-primary-600 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-primary-800 focus:ring-2 ring-blue-700"
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
