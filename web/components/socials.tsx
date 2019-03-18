import * as React from "react";
import fetch from "node-fetch";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface IState {
	discord: null | number
	youtube: null | number
	twitter: null | number
	instagram: null | number
	github: null | number
}


enum ESocial {
	TOOLTIP,
	URL,
	NETWORK,
}

class Stats extends React.Component<any, any> {
	state: IState = { discord: null, youtube: null, twitter: null, instagram: null, github: null }

	constructor(props) {
		super(props);
		this.getStats();
	}

	async getStats(): Promise<void> {
		this.setState({
			discord: (await fetch("https://discordapp.com/api/v6/invite/YFtfGwq?with_counts=true").then(data => data.json())).approximate_member_count.toLocaleString(),
			github: (await fetch("https://api.github.com/users/timothycole").then(data => data.json())).followers.toLocaleString(),
		});

		const socialblade = (await fetch("https://timcole.me/api/stats").then(data => data.json())).results;
		socialblade.map((result: any): void => {
			if (result.username != "modesttim" && result.channelid != "UCLvM67Ey6kNCasyEV2dvrbA") return;
			this.setState({ [result.type.toLowerCase()]: Number(`${result.followers || result.subscribers}`.replace(/,/g, '')).toLocaleString() });
		});
	}

	private socials: string[][] = [
		["Follow me on Twitch", "https://www.twitch.tv/modesttim", "twitch"],
		["Check out my GitHub", "https://github.com/TimothyCole", "github"],
		["Follow on Twitter", "https://twitter.com/modesttim", "twitter"],
		["Join us on Discord", "https://discordapp.com/invite/YFtfGwq", "discord"],
		["Subscribe on YouTube", "https://www.youtube.com/user/EatTim?sub_confirmation=1", "youtube"],
		["View my Instagram", "https://instagram.com/modesttim", "instagram"],
	]

	render () {
		return (
			<div className={this.props.className}>
			{this.socials.map((v: any) => (
				<a href={v[ESocial.URL]} target="_blank" key={v[ESocial.NETWORK]}>
					<div className={`button ${v[ESocial.NETWORK]}`} data-tooltip={`${v[ESocial.TOOLTIP]} - ${this.state[v[ESocial.NETWORK]]}`}>
						<FontAwesomeIcon icon={['fab', v[ESocial.NETWORK]]} />
					</div>
				</a>
			))}
			</div>
		)
	}
}

export default Stats;