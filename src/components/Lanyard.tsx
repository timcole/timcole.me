'use client';

import { FC, useEffect, useMemo, useState } from 'react';
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

  const jellyfin = useMemo(
    () =>
      doing?.activities.find(
        ({ application_id }) => application_id === '1053747938519679018',
      ),
    [doing],
  );

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

  if (!doing || (!jellyfin && !doing.spotify))
    return <div className="min-h-16 my-1 sm:my-0 sm:min-h-20"></div>;

  return (
    <div>
      <div className="flex items-center gap-4">
        <div className="relative sm:block hidden">
          {jellyfin?.assets.small_image && (
            <img
              src={jellyfin?.assets.small_image.replace(
                /mp:external\/([^\/]*)\/(http[s])/g,
                '$2:/',
              )}
              alt={`${jellyfin?.assets.small_text}`}
              title={`${jellyfin?.assets.small_text}`}
              className="flex-none object-cover w-6 h-6 bg-transparent border-2 rounded-full border-gray-900 absolute -bottom-2 -right-2"
            />
          )}
          <img
            src={
              doing.spotify?.album_art_url ||
              jellyfin?.assets.large_image.replace(
                /mp:external\/([^\/]*)\/(http[s])/g,
                '$2:/',
              )
            }
            alt={`${doing.spotify?.song || jellyfin?.details} Cover Image`}
            className="flex-none object-cover w-20 h-20 bg-gray-100 rounded-md"
          />
        </div>
        <div className="min-w-0 flex-auto">
          <p
            className={twMerge(
              'text-green-400 font-semibold',
              jellyfin &&
                'text-transparent bg-clip-text inline-block bg-gradient-to-br from-purple-500 to-sky-500 drop-shadow-md',
            )}
          >
            I'm currently {doing.spotify ? 'listening to' : `watching`}
          </p>
          <h2 className="text-white font-semibold truncate">
            {doing.spotify?.song || jellyfin?.details}
          </h2>
          <p className="text-gray-400 text-base font-medium">
            {doing.spotify?.artist || jellyfin?.state}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Lanyard;
