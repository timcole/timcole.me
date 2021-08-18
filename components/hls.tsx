import { FC, useEffect, useRef, useState } from 'react';
import ReactHlsPlayer from 'react-hls-player';
import { Orb } from './status';

type Props = { stream: string; image: string };

const Stream: FC<Props> = ({ stream, image }) => {
  const ref = useRef<HTMLVideoElement>();
  const [live, setLive] = useState<'live' | 'offline' | 'loading'>('loading');

  useEffect(() => {
    if (!ref?.current) return;

    const videoStart = () => setLive('live');
    const videoBuff = () => setLive('loading');
    const videoEnd = () => setLive('offline');

    ref.current.addEventListener('play', videoStart);
    ref.current.addEventListener('hlsError', videoBuff);
    ref.current.addEventListener('ended', videoEnd);

    return () => {
      ref.current.removeEventListener('play', videoStart);
      ref.current.removeEventListener('hlsError', videoBuff);
      ref.current.removeEventListener('ended', videoEnd);
    };
  }, [ref]);

  return (
    <div>
      <ReactHlsPlayer
        playerRef={ref}
        src={stream}
        poster={image}
        muted
        height={200}
        width={355.55}
        onClick={({ target }) => {
          if (!window.screenTop && !window.screenY) document.exitFullscreen();
          else (target as HTMLVideoElement)?.requestFullscreen();
        }}
        autoPlay
        hlsConfig={{
          maxLatency: 30,
          maxLoadingDelay: 10,
          minAutoBitrate: 0,
          lowLatencyMode: true,
          progressive: false,
        }}
      />
      <Orb
        color={
          live === 'live'
            ? '#f04747'
            : live === 'offline'
            ? '#747f8d'
            : '#faa61a'
        }
      >
        {live === 'live' && <p>Live</p>}
        {live === 'offline' && <p>Stream Offline</p>}
        {live === 'loading' && <p>Buffering...</p>}
      </Orb>
    </div>
  );
};

export default Stream;
