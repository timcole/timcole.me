import { IS_BROWSER } from "$fresh/runtime.ts";
import { Configuration, setup, strict } from "twind";

export * from "twind";
export const config: Configuration = {
  darkMode: "media",
  mode: strict,
};

if (IS_BROWSER) setup(config);
