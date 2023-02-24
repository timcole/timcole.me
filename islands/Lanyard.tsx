import { useEffect, useState } from "preact/hooks";
import { tw } from "twind";
import type { Presence } from "../types/lanyard.ts";

enum Operation {
  Event,
  Hello,
  Initialize,
  Heartbeat,
}

enum EventType {
  INIT_STATE = "INIT_STATE",
  PRESENCE_UPDATE = "PRESENCE_UPDATE",
}

type SocketEvent = {
  op: Operation;
  t: EventType;
  d: Presence | unknown;
};

const Lanyard = () => {
  const [socket] = useState<WebSocket | null>(() =>
    new WebSocket("wss://api.lanyard.rest/socket")
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
        send(Operation.Initialize, { subscribe_to_id: "83281345949728768" });
      } else if (op === Operation.Event) {
        if ([EventType.INIT_STATE, EventType.PRESENCE_UPDATE].includes(t)) {
          setDoing(d as Presence);
        }
      }
    };
  }, [socket]);

  useEffect(() => {
    const progressUpdate = setInterval(() => {
      if (!doing || !doing.listening_to_spotify) return;

      const total = doing.spotify.timestamps.end! -
        doing.spotify.timestamps.start;
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
    <div class="fixed sm:bottom-5 sm:right-5 bottom-0 bg-gray-900 rounded-md overflow-hidden sm:w-[500px] w-full shadow-md z-20">
      <div class="flex items-center space-x-3.5 p-2">
        <img
          src={doing.spotify.album_art_url}
          alt={`${doing.spotify.song} Album Art`}
          width="160"
          height="160"
          class="flex-none w-20 h-20 bg-gray-100 rounded-sm"
        />
        <div class="min-w-0 flex-auto">
          <p class="text-blue-400 text-sm font-semibold uppercase">
            I'm currently listening to
          </p>
          <h2 class="text-white text-xl font-semibold truncate">
            {doing.spotify.song}
          </h2>
          <p class="text-gray-400 text-base font-medium">
            {doing.spotify.artist}
          </p>
        </div>
      </div>
      <div class="bg-gray-700 overflow-hidden">
        <div
          class={tw`bg-blue-400 w-[${progress}%] h-1.5 transition duration-150`}
          role="progressbar"
          aria-label="Progress in song"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
        >
        </div>
      </div>
    </div>
  );
};

export default Lanyard;
