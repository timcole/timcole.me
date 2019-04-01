import * as React from "react";

import "../styles/spotify.scss";

class Spotify extends React.PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			song: null
		}

		this.checker = null
	}

	componentWillUnmount() { if (this.checker) clearInterval(this.checker);}
	componentDidMount() {
		this.checkSong();
		this.checker = setInterval(() => this.checkSong(), 3000);
	}

	async checkSong() {
		const spotify = await fetch(`https://spotify.aidenwallis.co.uk/u/5beb2bcc97ae3503e5f41c4f?json=true&ts=${Date.now()}`).then(data => data.json())
		if (spotify.error) {
			this.setState({ song: null });
			return;
		}

		let temp = document.createElement("p");
		temp.textContent = spotify.title;
		temp.style = "display: inline; visibility: hidden; font-size: 1.25rem;";
		document.body.appendChild(temp);
		let isMarquee = document.querySelector(".chat").offsetWidth - temp.offsetWidth - 75 <= 0;
		temp.remove();

		this.setState({
			song: {
				name: spotify.title,
				artists: spotify.artists.map(d => d.name).join(", "),
				art: spotify.albumCover,
				isMarquee
			}
		});
	}

	render() {
		const { song } = this.state;
		if (!song) return (<></>);

		return (
			<div className="spotify">
				<img src={song.art} alt="Album art" />
				<div className="meta">
					{song.isMarquee ? <marquee>{song.name}</marquee> : <p>{song.name}</p>}
					<span>{song.artists}</span>
				</div>
			</div>
		)
	}
}

export default Spotify;