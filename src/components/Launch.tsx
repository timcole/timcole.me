'use client';

import { FC, useEffect, useState } from 'react';

export type Props = {
  id: string;
  net: string;
  status:
    | 'Success'
    | 'Failure'
    | 'Partial Failure'
    | 'TBD'
    | 'TBC'
    | 'Go'
    | 'In Flight'
    | 'Hold';
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

const nextLaunchQuery = `
query {
  launches(
    limit: 1
    orderBy: {field: net, direction: ASC}
    filters: [{field: net, operation: gt, date: "NOW()"}]
  ) {
    id
    net
    status
    vehicle {
      image
    }
  }
}
`;

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
      days: String(days).padStart(2, '0'),
      hours: String(hours).padStart(2, '0'),
      minutes: String(minutes).padStart(2, '0'),
      seconds: String(seconds).padStart(2, '0'),
    },
  };
}

const Launch: FC = () => {
  const [time, setTime] = useState<FormattedTime>();
  const [launch, setLaunch] = useState<Props>();

  useEffect(() => {
    fetch('https://booster.spaceflight.live', {
      method: 'POST',
      headers: {
        'Content-type': 'application/json',
      },
      body: JSON.stringify({ query: nextLaunchQuery }),
    })
      .then(async (data) => {
        const {
          data: { launches },
        } = await data.json();
        setLaunch(launches.shift());
      })
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (!launch) return () => {};

    const formatter = setInterval(() => {
      setTime(formatTime(new Date(launch.net).getTime() - Date.now()));
    }, 100);

    return () => {
      clearInterval(formatter);
    };
  }, [launch]);

  return launch && time ? (
    <div className="items-center relative p-2 -mx-3 -mt-3 flex rounded-lg text-gray-800 dark:text-gray-100 shadow-lg bg-gray-100 dark:bg-gray-900 overflow-hidden">
      <div className="z-10 flex flex-col md:flex-row w-full items-center md:text-left">
        <p className="flex-1 pl-4">
          There{launch?.status === 'Go' ? "'s going to" : ' might'} be a rocket
          launch in{' '}
          <span className="tabular-nums px-1 font-semibold">
            T{time?.abs ? '-' : '+'}
            {Object.keys(time.diff)
              .map((key) => time.diff[key as keyof FormattedTimeDiff])
              .join(':')}
            ;
          </span>{' '}
          head on over to Spaceflight Live to see.
        </p>{' '}
        <a
          className="shadow border border-gray-700 bg-gray-700 text-white rounded-md px-4 py-2 m-2 transition duration-500 ease select-none hover:bg-gray-800 focus:ring-2 ring-blue-700"
          href="https://spaceflight.live"
          target="_blank"
        >
          Continue to Spaceflight.live
        </a>
      </div>
      <div
        style={{
          backgroundImage: `url(https://constellation.spaceflight.live/${launch?.vehicle.image})`,
        }}
        className="left-0 opacity-30 absolute select-none h-full w-full bg-center bg-cover"
      ></div>
    </div>
  ) : (
    /* This is only here to prevent a layout shift when the data loads lol */ <div className="h-[74px] -mt-3"></div>
  );
};

export default Launch;
