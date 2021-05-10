import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';

import Emoji from '../components/emoji';

export type Props = {
  id: string;
  net: string;
  status: 'Success' | 'Failure' | 'Partial Failure' | 'TBD' | 'TBC' | 'Go' | 'In Flight' | 'Hold';
};

type FormattedTime = {
  abs: boolean;
  diff: {
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
  };
};

// https://github.com/spaceflight-live/comet/blob/94d71e79a4bb93114a7743e11e46a5ed70a723f9/components/Countdown.tsx#L13
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

const Launch: FC<Props> = ({ net, status }) => {
  const [time, setTime] = useState<FormattedTime>(formatTime(new Date(net).getTime() - Date.now()));

  useEffect(() => {
    const formatter = setInterval(() => {
      setTime(formatTime(new Date(net).getTime() - Date.now()));
    }, 100);

    return () => {
      clearInterval(formatter);
    };
  }, [net]);

  return (
    <Notice href="https://spaceflight.live" target="_blank">
      <div>
        <p>
          <Emoji name="rocket" hex="1f680" /> There{status === 'Go' ? "'s going to" : ' might'} be a rocket launch in T
          {time.abs ? '-' : '+'}
          {Object.keys(time.diff)
            .map((key) => time.diff[key])
            .join(':')}
          ; head on over to Spaceflight Live to see.
        </p>
      </div>
    </Notice>
  );
};

export default Launch;

const Notice = styled.a`
  text-decoration: none;
  color: var(--text);

  div {
    background: var(--background_100);

    p {
      text-align: center;
      margin: 0;
      padding: 15px;
      font-size: 1.1em;
      text-shadow: 0 0.5px 1px rgba(37, 40, 48, 0.55);

      div {
        vertical-align: middle;
      }

      &:hover {
        border-left: 5px solid var(--accent);
        padding-left: 10px;
      }
    }
  }
`;
