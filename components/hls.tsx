import {
  FC,
  forwardRef,
  memo,
  RefObject,
  useMemo,
  useRef,
  useState,
  VideoHTMLAttributes,
} from 'react';
import { HlsPlayerProps } from 'react-hls-player';
import { Orb } from './status';
import dynamic from 'next/dynamic';

const ReactHlsPlayer = dynamic(() => import('react-hls-player'));

type Props = { stream: string; image: string };

const Player = memo(
  forwardRef<HTMLVideoElement, VideoHTMLAttributes<HTMLVideoElement>>(
    (props, ref) =>
      document
        .createElement('video')
        .canPlayType('application/vnd.apple.mpegurl') ? (
        <video
          ref={ref}
          onLoadedMetadata={async () => {
            (ref as RefObject<HTMLVideoElement>).current.play();
          }}
          {...props}
        ></video>
      ) : (
        <ReactHlsPlayer
          playerRef={ref as RefObject<HTMLVideoElement>}
          hlsConfig={{
            maxLatency: 60,
            maxLoadingDelay: 10,
            minAutoBitrate: 0,
            lowLatencyMode: true,
          }}
          {...(props as HlsPlayerProps)}
        />
      ),
  ),
  () => true,
);

const Stream: FC<Props> = ({ stream, image }) => {
  const ref = useRef<HTMLVideoElement>();
  const [live, setLive] = useState<'live' | 'offline' | 'loading'>('loading');

  const videoStart = () => setLive('live');
  const videoBuff = () => setLive('loading');
  const videoEnd = () => setLive('offline');

  const orb = useMemo(() => {
    return live === 'live'
      ? ['#f04747', 'Live']
      : live === 'offline'
      ? ['#747f8d', 'Stream Offline']
      : ['#faa61a', 'Buffering'];
  }, [live]);

  return (
    <div>
      <Player
        ref={ref}
        src={stream}
        poster={image}
        muted
        height={200}
        width={355.55}
        onPlay={videoStart}
        onEnded={videoEnd}
        onError={videoBuff}
        onClick={({ target }) => {
          if (!window.screenTop && !window.screenY) document.exitFullscreen();
          else (target as HTMLVideoElement)?.requestFullscreen();
        }}
        autoPlay
        playsInline
      />
      <Orb color={orb[0]}>
        <p>{orb[1]}</p>
      </Orb>
    </div>
  );
};

export default memo(Stream);
