import * as React from "react";

import "../styles/spotify.scss";

class Spotify extends React.PureComponent {
	constructor(props) {
		super(props);

		this.checker = null
	}

	componentDidUpdate() {
		const { song } = this.props;

		let temp = document.createElement("p");
		temp.textContent = song.song;
		temp.style = "display: inline; visibility: hidden; font-size: 1.25rem;";
		document.body.appendChild(temp);
		let isMarquee = document.querySelector(".chat").offsetWidth - temp.offsetWidth - 75 <= 0;
		temp.remove();

		this.setState({ isMarquee });
	}

	render() {
		const { song } = this.props;
		if (!song.is_playing) return (<></>);

		return (
			<div className="spotify">
				<img src={song.art} alt="Album art" />
				<div className="meta">
					{song.isMarquee ? <marquee>{song.song}</marquee> : <p>{song.song}</p>}
					<span>{song.artists}</span>
				</div>
			</div>
		)
	}
}

export default Spotify;