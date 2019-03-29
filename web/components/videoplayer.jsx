import React from 'react';
import Hls from "hls.js";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import "../styles/video.scss";

export default class VideoPlayer extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			playerId: Date.now(),
			quality: "_source",
			qualityName: "Source",
			playingIcon: "play",
			mutedIcon: "volume-mute",
			baseUrl: `https://live.tcole.me/hls/nda`,
			quality_options: [
				{ name: "Source", key: "_source" },
				{ name: "High", key: "_high" },
				{ name: "Medium", key: "_mid" },
				{ name: "Low", key: "_low" },
			]
		};

		this.hls = null;
	}

	lastQuality = null;
	componentDidUpdate() {
		if (this.state.quality != this.lastQuality) this._initPlayer();
	}

	componentDidMount() {
		this._initPlayer();
	}

	componentWillUnmount() {
		let { hls } = this;
		if (hls) hls.destroy();
	}

	_initPlayer() {
		const clean = this.hls ? true : false;
		if (clean) this.hls.destroy();
		this.lastQuality = this.state.quality;

		let {
			autoplay,
			hlsConfig
		} = this.props;
		let {
			video: $video,
			playPause,
			mute,
			volume,
			fullScreen
		} = this.refs;
		let hls = new Hls(hlsConfig);

		hls.loadSource(`${this.state.baseUrl}${this.state.quality}/index.m3u8?authorization=${this.props.authorization}`);
		hls.attachMedia($video);
		hls.on(Hls.Events.MANIFEST_PARSED, () => {
			if (autoplay) $video.play();
		});

		// Toggle Playback
		let togglePlayback = _ => {
			let action = $video.paused ? "play" : "pause";
			$video[action]();
			if (action === "play" && $video.duration) $video.currentTime = $video.duration;
		}
		playPause.addEventListener("click", togglePlayback);
		if (clean) playPause.removeEventListener("click", togglePlayback);

		// Toggle Mute
		let toggleMute = _ => {
			$video.muted = !$video.muted;
		};
		mute.addEventListener("click", toggleMute);
		if (clean) mute.removeEventListener("click", toggleMute);

		// Volume Slider
		volume.onchange = function () {
			$video.volume = volume.value / 100;
		};

		// Toogle Fullscreen
		let toggleFullscreen = _ => {
			let method;
			if ($video.requestFullscreen) {
				method = "requestFullscreen";
			} else if ($video.mozRequestFullScreen) {
				method = "mozRequestFullScreen";
			} else if ($video.webkitRequestFullscreen) {
				method = "webkitRequestFullscreen";
			}
			if (method) $video[method]();
		};
		fullScreen.addEventListener("click", toggleFullscreen);
		if (clean) fullScreen.removeEventListener("click", toggleFullscreen);

		// Quality Changer
		let qualityOptions = document.querySelectorAll("#quality #options li");
		qualityOptions.forEach(q => {
			q.addEventListener("click", _ => this.setState({ quality: q.dataset.name, qualityName: q.innerText }));
		});

		// Icon Handler
		$video.addEventListener("play", _ => { this.setState({ playingIcon: "pause" }) })
		$video.addEventListener("pause", _ => { this.setState({ playingIcon: "play" }) })
		$video.addEventListener("volumechange", _ => {
			this.setState({ mutedIcon: $video.muted ? "volume-mute" : "volume" })
		})

		this.hls = hls;
	}

	render() {
		const {
			playerId,
			qualityName,
			quality_options,
			playingIcon,
			mutedIcon
		} = this.state;
		const {
			controls,
			videoProps
		} = this.props;

		return (
			<div key={playerId} className="player">
				<video ref="video" muted autoPlay id={playerId} controls={controls} {...videoProps}></video>
				<div id="controls">
					<div className="left">
						<button ref="playPause"><FontAwesomeIcon icon={['fas', playingIcon]} /></button>
						<button ref="mute"><FontAwesomeIcon icon={['fas', mutedIcon]} /></button>
						<input type="range" ref="volume" min="0" max="100" step="1" defaultValue="100" />
					</div>
					<div className="right">
						<div id="quality">
							<p id="selected">{qualityName}</p>
							<ul id="options">
								{quality_options.map(d => <li data-name={d.key} key={d.key}>{d.name}</li>)}
							</ul>
						</div>
						<button ref="fullScreen"><FontAwesomeIcon icon={['fas', 'compress']} /></button>
					</div>
				</div>
			</div>
		);
	}
};