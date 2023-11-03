'use client';

import { FC, useEffect, useState } from 'react';
import type { Presence } from '@/types/lanyard';
import { twMerge } from 'tailwind-merge';

enum Operation {
  Event,
  Hello,
  Initialize,
  Heartbeat,
}

enum EventType {
  INIT_STATE = 'INIT_STATE',
  PRESENCE_UPDATE = 'PRESENCE_UPDATE',
}

type SocketEvent = {
  op: Operation;
  t: EventType;
  d: Presence | unknown;
};

const Lanyard: FC = () => {
  const [socket] = useState<WebSocket | null>(
    () => new WebSocket('wss://api.lanyard.rest/socket'),
  );
  const [doing, setDoing] = useState<Presence>();
  const [progress, setProgress] = useState<number>(0);

  const send = (op: Operation, d?: unknown): void => {
    if (socket !== null) socket.send(JSON.stringify({ op, d }));
  };

  useEffect(() => {
    if (socket === null) return () => {};
    socket.onmessage = function ({ data }: MessageEvent): void {
      const { op, t, d }: SocketEvent = JSON.parse(data);

      if (op === Operation.Hello) {
        setInterval(
          () => send(Operation.Heartbeat),
          (d as { heartbeat_interval: number }).heartbeat_interval,
        );
        send(Operation.Initialize, { subscribe_to_id: '83281345949728768' });
      } else if (op === Operation.Event) {
        if ([EventType.INIT_STATE, EventType.PRESENCE_UPDATE].includes(t)) {
          setDoing(d as Presence);
        }
      }
    };
  }, [socket]);

  useEffect(() => {
    if (!doing || !doing.listening_to_spotify) {
      document.getElementsByTagName('html')[0].setAttribute('data-artist', '');
      return;
    }

    document
      .getElementsByTagName('html')[0]
      .setAttribute('data-artist', doing.spotify.artist);

    const progressUpdate = setInterval(() => {
      const total =
        doing.spotify.timestamps.end! - doing.spotify.timestamps.start;
      setProgress(
        100 -
          (100 * (doing.spotify.timestamps.end! - new Date().getTime())) /
            total,
      );
    }, 250);

    return () => clearInterval(progressUpdate);
  }, [doing]);

  if (!doing || !doing.listening_to_spotify) return <div></div>;

  return (
    <div
      className={twMerge(
        'fixed sm:bottom-5 sm:right-5 bottom-0 bg-gray-900 rounded-md overflow-hidden sm:w-[500px] w-full shadow-md z-20',
        'group-data-olivia:bg-olivia-500',
        'group-data-taylor:bg-taylor-600',
      )}
    >
      <p className="p-2 text-center bg-olivia-300/30 group-data-olivia:block hidden">
        i'm <b>OBSESSED</b> with olivia rodrigo, while actively listening to her
        music this site is olivia themed
      </p>
      <p className="p-2 text-center bg-taylor-500/30 group-data-taylor:block hidden">
        I'm a Swiftie, while actively listening to Taylor Swift this site is
        1989 themed
      </p>
      <div className="flex items-center space-x-3.5 p-2">
        <img
          src={doing.spotify.album_art_url}
          alt={`${doing.spotify.song} Album Art`}
          width="160"
          height="160"
          className="flex-none w-20 h-20 bg-gray-100 rounded-sm"
        />
        <div className="min-w-0 flex-auto">
          <p
            className={twMerge(
              'text-blue-400 text-sm font-semibold uppercase',
              'group-data-olivia:text-white group-data-olivia:bg-olivia-300 group-data-olivia:inline group-data-olivia:lowercase group-data-olivia:px-2 group-data-olivia:rotate-12',
              'group-data-taylor:text-taylor-100',
            )}
          >
            I'm currently listening to
          </p>
          <h2 className="text-white text-xl font-semibold truncate">
            {doing.spotify.song}
          </h2>
          <p
            className={twMerge(
              'text-gray-400 text-base font-medium',
              'group-data-olivia:text-gray-200 group-data-olivia:lowercase',
              'group-data-taylor:text-taylor-100',
            )}
          >
            {doing.spotify.artist}
          </p>
        </div>
      </div>
      <div className="bg-gray-700 overflow-hidden">
        <div
          className={twMerge(
            'bg-blue-400 h-1.5 transition-width duration-150',
            'group-data-olivia:bg-violet-500',
          )}
          style={{ width: `${progress}%` }}
          role="progressbar"
          aria-label="Progress in song"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        ></div>
      </div>
    </div>
  );
};

export default Lanyard;
