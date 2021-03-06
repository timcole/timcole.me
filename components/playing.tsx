import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import { useLanyard } from './lanyard';

import Spotify from '../public/brands/spotify.svg';

const NowPlaying: FC = () => {
  const doing = useLanyard();

  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const progressUpdate = setInterval(() => {
      if (!doing || !doing.listening_to_spotify) return;

      const total = doing.spotify.timestamps.end - doing.spotify.timestamps.start;
      setProgress(100 - (100 * (doing.spotify.timestamps.end - new Date().getTime())) / total);
    }, 250);

    return () => clearInterval(progressUpdate);
  }, [doing]);

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

export default NowPlaying;

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

const Live = styled.div`
  width: 10px;
  height: 10px;
  position: absolute;
  right: 10px;
  top: 10px;
  border-radius: 50%;

  &:before {
    opacity: 0.8;
    position: absolute;
    text-align: right;
    top: -4px;
    right: 0px;
    display: block;
    min-width: 200px;
    content: "I'm currently listening to";
  }
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

const ProgressFill = styled.div.attrs((props: { progress: number }) => ({
  style: {
    transform: `translateX(${props.progress - 100}%)`,
  },
}))<{ progress: number }>`
  width: 100%;
  height: 5px;
  background-color: var(--accent);
  transition: transform 750ms;
`;
