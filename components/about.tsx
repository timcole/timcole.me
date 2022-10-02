import Launch, { Props } from "../islands/Launch.tsx";

const AboutMe = (props: Props) => (
  <div class="container mx-auto p-4 sm:p-12">
    <div class="items-center p-8 rounded-lg shadow-md lg:flex bg-white dark:bg-primary-700">
      <div class="lg:w-3/4">
        <h2 class="text-3xl font-bold text-primary-800 dark:text-primary-100">
          Timothy Cole
        </h2>

        <p class="mt-4 text-primary-500 dark:text-primary-300">
          A 25 year old, self-taught, software engineer from Raleigh, NC.
        </p>

        <p class="mt-4 text-primary-500 dark:text-primary-300">
          I prefer to write back-end code (Rust, TypeScript, Go), but do
          front-end as needed (React/NextJS TypeScript).
        </p>
        <p class="mt-4 text-primary-500 dark:text-primary-300">
          NeoVim is my editor of choice.{" "}
          <a
            href="https://github.com/timcole/dotfiles"
            target="_blank"
            class="border-b-2 border-double"
          >
            dotfiles
          </a>
        </p>

        <p class="mt-4 text-primary-500 dark:text-primary-400 font-italic">
          I have a pet ball python named Mila 🐍 but I don't program in python.
        </p>

        <div class="flex items-center mt-4 -mx-2 flex-col md:flex-row">
          <a
            class="m-2 shadow"
            href="https://twitter.com/modesttim"
            target="_blank"
            aria-label="Twitter"
          >
            <img src="https://img.shields.io/twitter/follow/ModestTim?color=00acee&label=@ModestTim&logo=twitter&logoColor=fff&style=flat-square" />
          </a>

          <a
            class="m-2 shadow"
            href="https://github.com/timcole"
            target="_blank"
            aria-label="Github"
          >
            <img src="https://img.shields.io/github/followers/timcole?color=161b22&label=Github&logo=github&logoColor=fff&style=flat-square" />
          </a>

          <a
            class="m-2 shadow"
            href="https://discord.gg/modest"
            target="_blank"
            aria-label="Discord"
          >
            <img src="https://img.shields.io/discord/313591755180081153?color=5865F2&label=Modest%20Labs%20Discord&logo=discord&logoColor=fff&style=flat-square" />
          </a>
        </div>
      </div>

      <div class="mt-8 lg:mt-0 lg:w-1/2">
        <div class="flex items-center justify-center lg:justify-end">
          <div class="max-w-lg">
            <img
              class="object-cover object-center w-auto h-64 rounded-md shadow shadow"
              src="https://tim.rip/me.jpg"
              alt="Picture of me"
            />
          </div>
        </div>
      </div>
    </div>
    <Launch {...props} />
  </div>
);

export default AboutMe;
