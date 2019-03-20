import { Component, DOMElement } from 'react';
import { Query } from "react-apollo";

import "../styles/subscribe_modal.scss"

class SubscribeModal extends Component<any> {
	private store: any

	constructor(props) {
		super(props)

		this.store = props.store
	}

	private badges: string[] = [
		"Subscriber",
		"3-Month Subscriber",
		"6-Month Subscriber",
		"9-Month Subscriber",
		"1-Year Subscriber",
		"2-Year Subscriber",
		"3-Year Subscriber",
		"4-Year Subscriber",
	];

	state = { selected: 0 };

	emotes(total: any[]): any[] {
		var emotes = []
		for (const [i, tier] of total.entries()) {
			if (i > this.state.selected) break;
			emotes.push(...tier.emotes)
		}
		return emotes
	}

	popout (url: string): void {
		window.open(url, "_blank", [
			"toolbar=no",
			"scrollbars=yes",
			"resizable=yes",
			"width=1200",
			"height=870"
		].join(","));
	}

	closeModal(e: any): void {
		e.preventDefault();

		if (e.currentTarget == e.target) {
			this.store.set({ showSubscribe: false });
		}
	}

	render() {
		return (
			<div className="modal-mask">
				<div className="modal-wrapper" onClick={this.closeModal.bind(this)}>
					<Query
						query={subQuery}
						variables={{ login: "modesttim" }}
					>
					{({ loading, error, data }) => {
						if (loading) return <p>Loading...</p>;
						if (error) return <p>Error :(</p>;
						const product = data.user.subscriptionProducts[this.state.selected];
						return (
							<div className="modal-container">
								<div className="modal-header">
									<h2>{product.displayName}</h2>
									<div onClick={() => this.popout(product.url)}>Continue to Twitch</div>
								</div>

								<div className="modal-body">
									<div className="m-left">
										<h4>Subscription benefits</h4>
										<ul>
											<li>Directly support the broadcaster</li>
											{product.hasAdFree ? (<li>Ad-free (with limited exceptions)</li>) : null}
											<li>Chat during subscriber-only mode</li>
											{product.hasFastChat ? (<li>Not affected by chat slow mode</li>) : null}
										</ul>
									</div>

									<div className="m-right">
										<h5>Subscriber Badges:</h5>
										<div className="flex-parent">
										{data.user.broadcastBadges.map((badge: any) => {
											if (badge.setID != "subscriber") return; 
											const style = { order: this.badges.indexOf(badge.description)}
											return (
												<div key={badge.imageURL} style={style} className="ToolTipContainer">
													<img src={badge.imageURL.replace('/1', '/3')} alt={badge.description} />
												</div>
											);
										})}
										</div>

										<h5>{ this.emotes(data.user.subscriptionProducts).length } Subscriber Emote:</h5>
										<div className="flex-parent">
										{this.emotes(data.user.subscriptionProducts).map((emote: any) => (
											<div key={emote.id} className="ToolTipContainer">
												<img src={`https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/4.0`} alt={emote.token} />
											</div>
										))}
										</div>
									</div>
								</div>

								<div className="modal-footer">
									{data.user.subscriptionProducts.map((tier: any, index: number) => (
										<div key={index} className={`type ${this.state.selected == index ? 'active' : ''}`} data-tier={index} onClick={(a: any) => this.setState({ selected: Number(a.currentTarget.dataset.tier) })}>
											<p>Tier {index + 1} <span>${(tier.priceInfo.total / 100).toFixed(2)}</span></p>
										</div>
									))}
								</div>
							</div>
						);
					}}
					</Query>
				</div>
			</div>
		)
	}
}

import gql from 'graphql-tag';
const subQuery = gql`
query getUser($login: String) {
	user(login: $login) {
		broadcastBadges {
			setID
			description
			imageURL
		}
		subscriptionProducts {
			displayName
			emotes {
				id
				setID
				token
			}
			priceInfo {
				currency
				total
			}
			url
			hasAdFree
			hasFastChat
		}
	}
}`;

export default SubscribeModal;
