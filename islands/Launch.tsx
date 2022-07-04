/** @jsx h */
import { h } from "preact";
import { useEffect, useState } from "preact/hooks";
import { tw } from "@twind";

export type Props = {
  id: string;
  net: string;
  status:
    | "Success"
    | "Failure"
    | "Partial Failure"
    | "TBD"
    | "TBC"
    | "Go"
    | "In Flight"
    | "Hold";
  vehicle: {
    image: string;
  };
};

type FormattedTime = {
  abs: boolean;
  diff: FormattedTimeDiff;
};

type FormattedTimeDiff = {
  days: string;
  hours: string;
  minutes: string;
  seconds: string;
};

function formatTime(time: number): FormattedTime {
  const abs = time >= 0;
  if (!abs) time = Math.abs(time);

  const days = Math.floor(time / (1000 * 60 * 60 * 24));
  const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((time % (1000 * 60)) / 1000);

  return {
    abs,
    diff: {
      days: String(days).padStart(2, "0"),
      hours: String(hours).padStart(2, "0"),
      minutes: String(minutes).padStart(2, "0"),
      seconds: String(seconds).padStart(2, "0"),
    },
  };
}

const Launch = ({ net, status, vehicle }: Props) => {
  const [time, setTime] = useState<FormattedTime>(
    formatTime(new Date(net).getTime() - Date.now()),
  );

  useEffect(() => {
    const formatter = setInterval(() => {
      setTime(formatTime(new Date(net).getTime() - Date.now()));
    }, 100);

    return () => {
      clearInterval(formatter);
    };
  }, [net]);

  return (
    <div
      class={tw
        `items-center relative p-2 -mx-3 -mt-3 flex rounded-lg text-gray-800 dark:text-gray-100 shadow-lg bg-gray-100 dark:bg-gray-900 overflow-hidden`}
    >
      <div
        class={tw
          `z-10 flex flex-col md:flex-row w-full items-center text-center md:text-left`}
      >
        <p class={tw`flex-1 pl-4`}>
          There{status === "Go" ? "'s going to" : " might"}{" "}
          be a rocket launch in{" "}
          <span class={tw`tabular-nums px-1 font-semibold`}>
            T
            {time.abs ? "-" : "+"}
            {Object.keys(time.diff)
              .map((key) => time.diff[key as keyof FormattedTimeDiff])
              .join(":")}
            ;
          </span>{" "}
          head on over to Spaceflight Live to see.
        </p>
        <a
          class={tw
            `shadow border border-gray-700 bg-gray-700 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-gray-800 focus:ring-2 ring-blue-700`}
          href="https://spaceflight.live"
          target="_blank"
        >
          Continue to Spaceflight.live
        </a>
      </div>
      <div
        style={`background-image: url('https://constellation.spaceflight.live/${vehicle.image}')`}
        class={tw
          `left-0 opacity-30 absolute select-none h-full w-full bg-center bg-cover`}
      >
      </div>
    </div>
  );
};

export default Launch;
