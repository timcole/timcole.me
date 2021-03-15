import { FC, useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { Presence } from '../types/lanyard';
import Image from 'next/image';

import Spotify from '../public/brands/spotify.svg';

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
  t?: EventType;
  d: Presence | unknown;
};

type Props = {
  url?: string;
  id: string;
};

const Lanyard: FC<Props> = ({ url = 'wss://api.lanyard.rest/socket', id }) => {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [doing, setDoing] = useState<Presence>();
  const [progress, setProgress] = useState<number>(0);

  const send = (op: Operation, d?: unknown): void => {
    if (socket !== null) socket.send(JSON.stringify({ op, d }));
  };

  useEffect(() => {
    const progresUpdate = setInterval(() => {
      if (!doing || !doing.listening_to_spotify) return;

      const total = doing.spotify.timestamps.end - doing.spotify.timestamps.start;
      setProgress(100 - (100 * (doing.spotify.timestamps.end - new Date().getTime())) / total);
    }, 250);

    return () => clearInterval(progresUpdate);
  }, [doing]);

  useEffect(() => {
    if (socket === null) return () => {};
    socket.onmessage = function ({ data }: MessageEvent): void {
      const { op, t, d }: SocketEvent = JSON.parse(data);

      if (op === Operation.Hello) {
        setInterval(() => send(Operation.Heartbeat), (d as { heartbeat_interval: number }).heartbeat_interval);
        send(Operation.Initialize, { subscribe_to_id: id });
      } else if (op === Operation.Event)
        if ([EventType.INIT_STATE, EventType.PRESENCE_UPDATE].includes(t)) setDoing(d as Presence);
    };
  }, [socket]);

  useEffect(() => {
    if (socket !== null) return () => {};
    setSocket(new WebSocket(url));
  }, []);

  if (!doing || !doing.listening_to_spotify) return <></>;

  return (
    <Doing>
      <Flex>
        <AlbumArt>
          <Image src={doing.spotify.album_art_url} width={69} height={69} />
        </AlbumArt>
        <Details>
          <Song>{doing.spotify.song}</Song>
          <Artist>{doing.spotify.artist}</Artist>
        </Details>
        <Live />
        <a href={`https://open.spotify.com/track/${doing.spotify.track_id}`} target="_blank" rel="noopener">
          <Logo />
        </a>
      </Flex>
      <Progress>
        <ProgressFill progress={progress} />
      </Progress>
    </Doing>
  );
};

export default Lanyard;

const Flex = styled.div`
  display: flex;
`;

const Doing = styled(Flex)`
  background: var(--background);
  flex-direction: column;
  box-shadow: 0 4px 4px 0 rgba(37, 40, 48, 0.5);
  font-size: 0.8rem;
  position: relative;
`;

const fadeInOut = keyframes`
  0% {
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    opacity: 0%;
  }
`;

const Live = styled.div`
  width: 10px;
  height: 10px;
  background: #ff5d4e;
  position: absolute;
  right: 10px;
  top: 10px;
  border-radius: 50%;
  animation: ${fadeInOut} 2s ease-in-out infinite;
`;

const AlbumArt = styled(Flex)`
  padding: 6px;
`;

const Details = styled(Flex)`
  padding-left: 15px;
  flex: 1;
  flex-direction: column;
  justify-content: center;
`;

const Song = styled.h4`
  margin: 0;
  font-size: 1.6em;
`;

const Artist = styled(Song)`
  font-weight: normal;
  margin: 0;
  font-size: 1.3em;
`;

const Logo = styled(Spotify)`
  position: absolute;
  bottom: 10px;
  right: 10px;
  height: 32px;
  opacity: 0.3;
  color: #1db954;
  transition: ease-in-out 150ms;

  &:hover {
    opacity: 1;
    bottom: 12px;
  }
`;

const Progress = styled.div`
  width: 100%;
  height: 5px;
  overflow: hidden;
  background: var(--background_200);
  opacity: 0.6;
`;

const ProgressFill = styled.div<{ progress: number }>`
  width: 100%;
  height: 5px;
  background-color: var(--accent);
  transition: transform 750ms;
  transform: translateX(${(props) => props.progress - 100}%);
`;
