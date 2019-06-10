import * as React from "react";

import "../styles/spotify.scss";

interface Props {
	song: ISong
}

interface ISong {
	is_playing: boolean
	song: string
	artists: string
	art: string
	link: string
	duration_ms: number
	progress_ms: number
}

class Spotify extends React.PureComponent<Props, {}> {
	constructor(props) {
		super(props);
	}

	componentDidUpdate() {
		// const { song } = this.props;

		// let temp: any = document.createElement("p");
		// temp.textContent = song.song;
		// temp.style = "display: inline; visibility: hidden; font-size: 1.25rem;";
		// document.body.appendChild(temp);
		// let chat: HTMLDivElement = document.querySelector(".chat");
		// let isMarquee = chat.offsetWidth - temp.offsetWidth - 75 <= 0;
		// temp.remove();

		// this.setState({ isMarquee });
	}

	render() {
		const { song } = this.props;
		if (!song.is_playing) return (<></>);

		return (
			<div className="spotify">
				<img src={song.art} alt="Album art" />
				<div className="meta">
					<p>{song.song}</p>
					<span>{song.artists}</span>
				</div>
			</div>
		)
	}
}

export default Spotify;