import React from "react";
import Hls from "hls.js";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import "../styles/video.scss";
import { IconName } from "@fortawesome/pro-solid-svg-icons";
import { Icon } from "@fortawesome/fontawesome-svg-core";

interface Props {
  authorization: string;
  autoplay: boolean;
  controls: boolean;
  muted: boolean;
  options: any;
}

interface State {
  playerId: string;
  quality: string;
  qualityName: string;
  playingIcon: string;
  mutedIcon: string;
  baseUrl: string;
  volume: number;
  buffering: boolean;
  isLiveChecker?: NodeJS.Timeout;
  quality_options: IQuality[];
}

interface IQuality {
  name: string;
  key: string;
}

export default class VideoPlayer extends React.Component<Props, State> {
  private hls: Hls = null;
  public refs: {
    video: HTMLVideoElement;
    videoPlayer: HTMLDivElement;
    playPause: HTMLButtonElement;
    mute: HTMLButtonElement;
    volume: HTMLInputElement;
    fullScreen: HTMLButtonElement;
  };

  constructor(props) {
    super(props);

    this.state = {
      playerId: Date.now().toString(),
      quality: "_source",
      qualityName: "Source",
      playingIcon: "play",
      mutedIcon: "volume-mute",
      baseUrl: `https://live.tcole.me/hls/nda`,
      volume: 1,
      buffering: false,
      isLiveChecker: null,
      quality_options: [
        { name: "Source", key: "_source" },
        { name: "Low Bandwidth", key: "_high" },
      ],
    };
  }

  private lastQuality?: string = null;
  componentDidUpdate() {
    if (this.state.quality != this.lastQuality) this.initPlayer();
  }
  componentDidMount() {
    this.initPlayer();
  }
  componentWillUnmount() {
    let { hls } = this;
    if (hls) hls.destroy();
  }

  private initPlayer(): void {
    const clean: boolean = this.hls ? true : false;
    if (clean) this.hls.destroy();
    this.lastQuality = this.state.quality;

    let { autoplay } = this.props;
    let { video: $video, playPause, mute, volume, fullScreen } = this.refs;

    let hls: Hls = new Hls({
      maxBufferLength: 10,
      maxMaxBufferLength: 60,
      maxLoadingDelay: 2,
      liveSyncDurationCount: 1,
      liveMaxLatencyDurationCount: 10,
      liveSyncPosition: 3000,
    });

    hls.loadSource(
      `${this.state.baseUrl}${this.state.quality}/index.m3u8?authorization=${this.props.authorization}`
    );
    hls.attachMedia($video);
    hls.on(Hls.Events.MANIFEST_PARSED, () => {
      if (autoplay) $video.play();
    });
    hls.on(Hls.Events.ERROR, (_, { type }) => {
      if (type === "networkError") this.isLiveCheck();
    });

    this.hls = hls;

    // Toggle Playback
    let togglePlayback = function (): void {
      let action = $video.paused ? "play" : "pause";
      $video[action]();
      if (action === "play" && $video.duration)
        $video.currentTime = $video.duration;
    };
    playPause.addEventListener("click", togglePlayback);
    if (clean) playPause.removeEventListener("click", togglePlayback);

    // Toggle Mute
    let toggleMute = function (): void {
      $video.muted = !$video.muted;
      $video.volume = $video.muted ? 0 : this.state.volume;
      volume.value = String($video.muted ? 0 : this.state.volume * 100);
    }.bind(this);
    mute.addEventListener("click", toggleMute);
    if (clean) mute.removeEventListener("click", toggleMute);

    // Volume Slider
    volume.onchange = function (): void {
      $video.volume = Number(volume.value) / 100;
      if (!$video.muted) this.setState({ volume: $video.volume });
    }.bind(this);

    // Toogle Fullscreen
    let isFullscreen: boolean = false;
    let toggleFullscreen = function (): void {
      let { videoPlayer } = this.refs;

      let method: string;
      if (!isFullscreen) {
        // @ts-ignore
        method = videoPlayer.requestFullscreen
          ? "requestFullscreen"
          : videoPlayer.mozRequestFullScreen
          ? "mozRequestFullScreen"
          : "webkitRequestFullscreen";

        if (!method) return;
        videoPlayer[method]();
      } else if (isFullscreen) {
        // @ts-ignore
        let isMoz = document.mozCancelFullScreen;
        method = document.exitFullscreen
          ? "exitFullscreen"
          : isMoz
          ? "mozCancelFullScreen"
          : "webkitExitFullscreen";
        document[method]();
      }
      isFullscreen = !isFullscreen;
    }.bind(this);
    fullScreen.addEventListener("click", toggleFullscreen);
    if (clean) fullScreen.removeEventListener("click", toggleFullscreen);

    // Quality Changer
    let qualityOptions: NodeListOf<HTMLLIElement> = document.querySelectorAll(
      "#quality #options li"
    );
    qualityOptions.forEach((q) => {
      q.addEventListener("click", (_) =>
        this.setState({ quality: q.dataset.name, qualityName: q.innerText })
      );
    });

    // Icon Handler
    $video.addEventListener("play", (_) => {
      this.setState({ playingIcon: "pause" });
      setTimeout(() => {
        if ($video.duration) $video.currentTime = $video.duration - 4;
      });
    });
    $video.addEventListener("pause", (_) => {
      this.setState({ playingIcon: "play" });
    });
    $video.addEventListener("volumechange", (_) => {
      this.setState({ mutedIcon: $video.muted ? "volume-mute" : "volume" });
    });

    $video.addEventListener("waiting", () => {
      this.setState({ buffering: true });
    });
    $video.addEventListener("playing", () => {
      this.setState({ buffering: false });
    });
  }

  isLiveCheck() {
    const { isLiveChecker } = this.state;
    if (isLiveChecker != null) clearInterval(isLiveChecker);

    this.setState({
      isLiveChecker: setInterval(async () => {
        const isLive = await fetch(
          `${this.state.baseUrl}${this.state.quality}/index.m3u8?authorization=${this.props.authorization}`
        ).then(({ status }) => status);
        if (isLive) {
          this.initPlayer();
          clearInterval(this.state.isLiveChecker);
        }
      }, 2000),
    });
  }

  render() {
    const {
      playerId,
      qualityName,
      quality_options,
      playingIcon,
      mutedIcon,
      buffering,
    } = this.state;
    const { controls } = this.props;

    return (
      <div
        key={playerId}
        className={`player ${buffering ? "buffering" : ""}`}
        ref="videoPlayer"
      >
        <video
          ref="video"
          poster="https://static-cdn.jtvnw.net/jtv_user_pictures/5137fa06-4eff-420a-bbe5-366774c5706d-channel_offline_image-1920x1080.png"
          muted
          id={playerId}
          controls={controls}
        ></video>
        <div id="controls">
          <div className="left">
            <button ref="playPause">
              <FontAwesomeIcon icon={["fas", playingIcon as IconName]} />
            </button>
            <button ref="mute">
              <FontAwesomeIcon icon={["fas", mutedIcon as IconName]} />
            </button>
            <input
              type="range"
              ref="volume"
              min="0"
              max="100"
              step="1"
              defaultValue="0"
            />
          </div>
          <div className="right">
            <div id="quality">
              <p id="selected">{qualityName}</p>
              <ul id="options">
                {quality_options.map((d) => (
                  <li data-name={d.key} key={d.key}>
                    {d.name}
                  </li>
                ))}
              </ul>
            </div>
            <button ref="fullScreen">
              <FontAwesomeIcon icon={["fas", "compress"]} />
            </button>
          </div>
        </div>
      </div>
    );
  }
}

