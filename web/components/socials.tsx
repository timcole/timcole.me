import * as React from "react";
import fetch from "node-fetch";

interface IState {
	discord: null | number
	youtube: null | number
	twitter: null | number
	instagram: null | number
	github: null | number
}

class Stats extends React.Component<any, any> {
	state: IState = { discord: null, youtube: null, twitter: null, instagram: null, github: null }

	constructor(props) {
		super(props);
		this.getStats();
	}

	async getStats () {
		this.setState({
			discord: (await fetch("https://discordapp.com/api/v6/invite/YFtfGwq?with_counts=true").then(data => data.json())).approximate_member_count.toLocaleString(),
			github: (await fetch("https://api.github.com/users/timothycole").then(data => data.json())).followers.toLocaleString(),
		});

		const socialblade = (await fetch("https://timcole.me/api/stats").then(data => data.json())).results;
		socialblade.map(result => {
			if (result.username != "modesttim" && result.channelid != "UCLvM67Ey6kNCasyEV2dvrbA") return;
			this.setState({ [result.type.toLowerCase()]: Number(`${result.followers || result.subscribers}`.replace(/,/g, '')).toLocaleString() });
		});
	}

	private socials: string[][] = [
		["Follow me on Twitch", "https://www.twitch.tv/modesttim", "twitch"],
		["Check out my GitHub", "https://github.com/TimothyCole", "github"],
		["Follow on Twitter", "https://twitter.com/modesttim", "twitter"],
		["Join us on Discord", "https://discordapp.com/invite/YFtfGwq", "discord"],
		["View my Instagram", "https://instagram.com/modesttim", "instagram"],
		["Subscribe on YouTube", "https://www.youtube.com/user/EatTim?sub_confirmation=1", "youtube"],
	]

	render () {
		return (
			<div className={this.props.className}>
				{this.socials.map(v => (
					<a href={v[1]} target="_blank" key={v[2]}>
						<div className={`button ${v[2]}`}>
							{/* Social Media Name */ v[0]}
							{/* Social Media Stat */ this.state[v[2]] ? (<span>{this.state[v[2]]}</span>) : "" }
						</div>
					</a>
				))}
			</div>
		)
	}
}

export default Stats;