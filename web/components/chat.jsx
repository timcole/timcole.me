import * as React from "react";

import "../styles/chat.scss";

import Spotify from "./spotify";

class Chat extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			connected: false,
			client: null,
			mounted: false,
			chat: [],
			viewers: 0,
			username: "",
			emotes: {},
			client_id: "kimne78kx3ncx6brgo4mv6wki5h1ko",
			emote_sets: [
				0, // Global
				19194, // Twitch Prime
				293434, // ModestTim T1
				293441, // ModestTim T2
				293442, // ModestTim T3
				3421, // SocialBladeGaming
				5079, // LoserFruit
				4132, // Scrubing T1
				26012, // Scrubing T2
				26013, // Scrubing T3
				266611, // MrDemonWolf T1
				266612, // MrDemonWolf T2
				266613, // MrDemonWolf T3
				105, // SodaPoppin T1
				36711, // SodaPoppin T2
				36712, // SodaPoppin T3
				19503, // xQcOW T1
				31465, // xQcOW T2
				31466, // xQcOW T3
			]
		}

		this.loadEmotes();
		this.focusInput = this.focusInput.bind(this);
	}

	componentDidMount() { this.connectToChat(); }
	connectToChat () {
		this.setState({ username: localStorage.getItem("Username") });
		this.url = this.props.isDev ? "ws://127.0.0.1:6969/ws" : "wss://timcole.me/ws";
		if (this.state.connected) this.state.client.close();
		let client = new WebSocket(`${this.url}?authorization=${this.props.authorization}`);
		this.setState({ client, connected: true });

		client.onopen = () => {
			console.log('Chat Connected');
			client.send(`{"type":"LISTEN","data":{"topics":["chat.receive","chat.viewers"]}}`);
		}

		client.onmessage = ({ data: wsData }) => {
			let { data: { topics, data: msg } } = JSON.parse(wsData);
			if (!msg) return;

			if (topics == "chat.viewers") this.setState({ viewers: msg })
			if (topics == "chat.receive" || topics == "chat.send") {
				msg.ts = new Date();

				if (msg.message.substring(0, 4) === "/me ") {
					msg.message = msg.message.substring(4);
					msg.action = true;
				}

				msg.message = this.processMsg(msg.message);
				this.setState({ chat: [...this.state.chat, msg] });

				const { messages } = this.refs;
				if (messages) messages.scrollTop = messages.scrollHeight;
			}
		}

		client.onclose = () => {
			if (!this.state.connected) return;
			this.setState({
				connected: false,
				chat: [...this.state.chat, {
				ts: new Date(),
				message: "Disconnected, Attempting to reconnect."
			}]});
			setTimeout(() => this.connectToChat(), 3000);
		}
		this.sendMsg = this.sendMsg.bind(this);
	}

	loadEmotes () {
		Promise.all([
			fetch(`https://api.betterttv.net/2/channels/modesttim`).then(data => data.json()),
			fetch(`https://api.betterttv.net/2/emotes`).then(data => data.json()),
			fetch(`https://api.frankerfacez.com/v1/room/modesttim`).then(data => data.json()),
			fetch(`https://api.frankerfacez.com/v1/set/global`).then(data => data.json()),
			fetch(`https://api.twitch.tv/kraken/chat/emoticon_images?client_id=${this.state.client_id}&emotesets=${this.state.emote_sets.join(",")}`).then(data => data.json()),
		]).then(values => {
			values.map(data => {
				switch (true) {
					// BetterTTV
					case !!data.emotes && !!data.urlTemplate:
						data.emotes.map(({ code, id }) => {
							this.setState({ emotes: { ...this.state.emotes, [code]: `https://cdn.betterttv.net/emote/${id}/1x` } })
						});
						break;

					// FrankerFaceZ
					case !!data.sets:
						Object.entries(data.sets).map(([ _, { emoticons } ]) => {
							emoticons.map(({ name, urls }) => {
								if (!urls["1"]) return;
								this.setState({ emotes: { ...this.state.emotes, [name]: urls["1"] } })
							})
						})
						break;

					// Twitch Direct
					case !!data.emoticon_sets:
						Object.entries(data.emoticon_sets).map(([ _, emotes ]) => {
							emotes.map(({ id, code }) => {
								this.setState({ emotes: { ...this.state.emotes, [code]: `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0` } })
							})
						})
						break;

					// IDK What this one is lol
					default:
						break;
				}
			});
		});
	}

	processMsg (message) {
		let msg = "";
		// Remove HTML
		let dummy = document.createElement("div");
		dummy.innerHTML = message;
		msg = dummy.innerText;
		// Process
		msg = this.hyperlink(msg);
		msg = this.mentions(msg);
		msg = this.emotes(msg);
		return msg;
	}

	emotes (msg) {
		const { emotes } = this.state;
		let words = msg.split(" ").map(word => {
			if (!emotes[word]) return word;
			return `<img src="${emotes[word]}" title="${word}" alt="${word} emote" />`;
		})
		return words.join(" ");
	}

	mentions (msg) {
		const { username } = this.state;
		if (username == null) return msg;

		let lowerName = username.toLowerCase();
		let words = msg.split(" ").map(word => {
			if (lowerName != word) return word;
			return `<span class="tag">${lowerName}</span>`;
		})
		return words.join(" ");
	}

	hyperlink (msg) {
		return msg.replace(/(https?:\/\/[^\s]+)/g, "<a href='$1' target='_blank'>$1</a>");
	}

	sendMsg (e) {
		if (e.key !== 'Enter') return;
		let msg = e.target.value;
		e.target.value = "";

		if (msg.length > 0) this.state.client.send(JSON.stringify({
			type: "LISTEN",
			data: {
				topics: ["chat.send"],
				data: msg
			}
		}));
	}

	focusInput () {
		const { chatInput } = this.refs;
		// chatInput.focus();
	}

	render () {
		const { isChatOnly, isChatHidden } = this.props;
		const { chat, viewers } = this.state;
		return (
			<div className={`chat ${isChatOnly ? 'isChatOnly' : ''} ${isChatHidden ? 'isChatHidden' : ''}`} onClick={this.focusInput}>
				<Spotify />
				<div className="viewers">Viewers: {viewers}</div>
				<div className="messages" ref="messages">
					{chat.map((msg, i) => (
						<p key={i} className={msg.action ? "action" : ""}>
							<span className="time">{msg.ts.toLocaleTimeString()}</span>
							{msg.username ? <span className="username" data-name={msg.username}>{msg.username}</span> : ''}
							<span className="message" dangerouslySetInnerHTML={{__html: msg.message}}></span>
						</p>
					))}
				</div>
				<input ref="chatInput" className="sendMsg" type="text" onKeyPress={this.sendMsg} />
			</div>
		)
	}
};

export default Chat;