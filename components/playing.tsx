import { FC, useEffect, useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';

import { useLanyard } from './lanyard';

import Spotify from '../public/brands/spotify.svg';

const NowPlaying: FC = () => {
  const [doing] = useLanyard();
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    const progressUpdate = setInterval(() => {
      if (!doing || !doing.listening_to_spotify) return;

      const total =
        doing.spotify.timestamps.end - doing.spotify.timestamps.start;
      setProgress(
        100 -
          (100 * (doing.spotify.timestamps.end - new Date().getTime())) / total,
      );
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
        <a
          href={`https://open.spotify.com/track/${doing.spotify.track_id}`}
          target="_blank"
          rel="noopener"
        >
          <Logo data-icon="spotify" />
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
  background: var(--background_200);
  box-shadow: rgba(0, 0, 0, 0.25) 0px 2px 4px;
  border-radius: 10px;
  flex-direction: column;
  font-size: 0.8rem;
  position: fixed;
  width: 450px;
  max-width: 100%;
  bottom: 10px;
  right: 10px;
  z-index: 1;
  overflow: hidden;

  @media only screen and (max-width: 600px) {
    width: calc(100% - 20px);
    margin: 0 auto;
  }
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

  img {
    border-radius: 8px;
  }
`;

const Details = styled(Flex)`
  padding-left: 15px;
  flex: 1;
  flex-direction: column;
  justify-content: center;
  max-width: 300px;
`;

const Song = styled.h4`
  margin: 0;
  font-size: 1.4em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const Artist = styled(Song)`
  font-weight: normal;
  margin: 0;
  font-size: 1em;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
