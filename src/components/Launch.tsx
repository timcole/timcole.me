'use client';

import { exclude } from '@/utils/exclude';
import { FormattedTime, FormattedTimeDiff, formatTime } from '@/utils/time';
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
    <p>
      There{launch?.status === 'Go' ? "'s going to" : ' might'} be a rocket
      launch in{' '}
      <span className="tabular-nums italic">
        T{time?.abs ? '-' : '+'}
        {Object.keys(exclude(time.diff, 'years'))
          .map((key) =>
            String(time.diff[key as keyof FormattedTimeDiff]).padStart(2, '0'),
          )
          .join(':')}
      </span>
    </p>
  ) : (
    <p className="whitespace-pre"> </p>
  );
};

export default Launch;
