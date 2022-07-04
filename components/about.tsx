/** @jsx h */
import { h } from "preact";
import { tw } from "@twind";

import Launch, { Props } from "../islands/Launch.tsx";

const AboutMe = (props: Props) => (
  <div class={tw`container mx-auto p-4 sm:p-12`}>
    <div
      class={tw
        `items-center p-8 rounded-lg shadow-md lg:flex bg-white dark:bg-gray-700`}
    >
      <div class={tw`lg:w-3/4`}>
        <h2
          class={tw`text-3xl font-bold text-gray-800 dark:text-gray-100`}
        >
          Timothy Cole
        </h2>

        <p class={tw`mt-4 text-gray-500 dark:text-gray-300`}>
          A 25 year old, self-taught, software engineer from Raleigh, NC.
        </p>

        <p class={tw`mt-4 text-gray-500 dark:text-gray-300`}>
          I prefer to write back-end code (Rust, TypeScript, Go), but do
          front-end as needed (React/NextJS TypeScript).
        </p>
        <p class={tw`mt-4 text-gray-500 dark:text-gray-300`}>
          NeoVim is my editor of choice.{" "}
          <a
            href="https://github.com/timcole/dotfiles"
            target="_blank"
            class={tw`border-b-2 border-double`}
          >
            dotfiles
          </a>
        </p>

        <p class={tw`mt-4 text-gray-500 dark:text-gray-400 font-italic`}>
          I have a pet ball python named Mila 🐍 but I don't program in python.
        </p>

        <div class={tw`flex items-center mt-4 -mx-2 flex-col md:flex-row`}>
          <a
            class={tw`m-2 shadow`}
            href="https://twitter.com/modesttim"
            target="_blank"
            aria-label="Twitter"
          >
            <img src="https://img.shields.io/twitter/follow/ModestTim?color=00acee&label=@ModestTim&logo=twitter&logoColor=fff&style=flat-square" />
          </a>

          <a
            class={tw`m-2 shadow`}
            href="https://github.com/timcole"
            target="_blank"
            aria-label="Github"
          >
            <img src="https://img.shields.io/github/followers/timcole?color=161b22&label=Github&logo=github&logoColor=fff&style=flat-square" />
          </a>

          <a
            class={tw`m-2 shadow`}
            href="https://discord.gg/modest"
            target="_blank"
            aria-label="Discord"
          >
            <img src="https://img.shields.io/discord/313591755180081153?color=5865F2&label=Modest%20Labs%20Discord&logo=discord&logoColor=fff&style=flat-square" />
          </a>
        </div>
      </div>

      <div class={tw`mt-8 lg:mt-0 lg:w-1/2`}>
        <div class={tw`flex items-center justify-center lg:justify-end`}>
          <div class={tw`max-w-lg`}>
            <img
              class={tw
                `object-cover object-center w-full h-64 rounded-md shadow shadow`}
              src="https://tim.rip/me.jpg"
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
    <Launch {...props} />
  </div>
);

export default AboutMe;
