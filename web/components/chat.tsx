import * as React from "react";

import "../styles/chat.scss";

import Spotify from "./spotify";

interface Props {
	isChatHidden: boolean
	isChatOnly: boolean
	isDev: boolean
	authorization: string
}

interface State {
	connected: boolean,
	client?: WebSocket,
	mounted: boolean,
	chat: any[],
	viewers: number,
	username: string,
	emotes: any,
	spotify: any,
	client_id: string,
	emote_sets: EmoteSet[],
	emoteMenuOpen: boolean,
	emoteMenuSelected: number,
	emoteSearching: boolean
	emoteSearch: string
}

interface EmoteSet {
	name: string
	sets: number[]
}

class Chat extends React.Component<Props, State> {
	private url = this.props.isDev ? "ws://127.0.0.1:6969/ws" : "wss://timcole.me/ws";

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
			spotify: {},
			client_id: "kimne78kx3ncx6brgo4mv6wki5h1ko",
			emote_sets: [
				{
					name: "ModestTim",
					sets: [ 293434, 293441, 293442 ]
				},
				{
					name: "LoserFruit",
					sets: [	5079 ],
				},
				{
					name: "AidenWallis",
					sets: [ 1000525, 1000526, 1000527 ],
				},
				{
					name: "SodaPoppin",
					sets: [ 105, 36711, 36712 ],
				},
				{
					name: " xQcOW",
					sets: [ 19503, 31465, 31466 ],
				},
				{
					name: "Scrubing",
					sets: [ 4132, 26012, 26013 ]
				},
				{
					name: "MrDemonWolf",
					sets: [ 266611, 266612, 266613 ],
				},
				{
					name: "Ziggy",
					sets: [ 218096, 218098, 218099 ],
				},
				{
					name: "Prime",
					sets: [ 19194 ]
				},
				{
					name: "Global",
					sets: [ 0 ]
				}
			],
			emoteMenuOpen: false,
			emoteMenuSelected: 0,
			emoteSearching: false,
			emoteSearch: ""
		}

		this.loadEmotes();
	}

	componentDidMount() { this.connectToChat(); }
	componentWillUnmount() { if (this.props.isDev) location.reload(); }

	private pinger?: number = null;
	private connectToChat(): void {
		this.setState({ username: localStorage.getItem("Username") });
		if (this.state.connected) this.state.client.close();
		let client: WebSocket = new WebSocket(`${this.url}?authorization=${this.props.authorization}`);
		this.setState({ client, connected: true });

		client.onopen = () => {
			console.log('Chat Connected');
			client.send(`{"type":"LISTEN","data":{"topics":["chat.receive","chat.viewers","spotify.playback"]}}`);

			if (this.pinger) clearInterval(this.pinger);
			this.pinger = setInterval(function() {
				client.send(`{"type":"LISTEN","data":{"topics":["ping"]}}`);
			}, 60000)
		}

		let totalSystemMessage: number = 0;
		client.onmessage = ({ data: wsData }) => {
			let { data: { topics, data: msg } } = JSON.parse(wsData);
			if (!msg) return;
			
			if (topics == "spotify.playback") this.setState({ spotify: msg })
			if (topics == "chat.viewers") this.setState({ viewers: msg })
			if (topics == "chat.receive") {
				msg.ts = new Date();
				if (msg.username == "") totalSystemMessage++;

				if (msg.message.substring(0, 4) === "/me ") {
					msg.message = msg.message.substring(4);
					msg.action = true;
				}

				msg.message = this.processMsg(msg.message);
				this.setState({ chat: [...this.state.chat, msg] });
			}
			if (topics == "chatters") {
				msg.ts = new Date();
				msg.username = "bot";

				msg.message = `Chatters: ${[msg.map(chatter => {
					return `<span style="font-weight: 400" data-name="${chatter.username}">${chatter.username.replace(/^\w/, c => { return c.toUpperCase() })}</span> `;
				})].join(",")}`;
				this.setState({ chat: [...this.state.chat, msg] });
			}

			const messages: any = this.refs.messages;
			if (messages) messages.scrollTop = messages.scrollHeight;

			if (totalSystemMessage == 2) {
				client.send(`{"type":"LISTEN","data":{"topics":["chatters"]}}`);
				totalSystemMessage = 0;
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

	async loadEmotes(): Promise<void> {
		let emotes: any = await Promise.all([
			fetch(`https://api.betterttv.net/2/channels/modesttim`).then(data => data.json()),
			fetch(`https://api.betterttv.net/2/emotes`).then(data => data.json()),
			fetch(`https://api.frankerfacez.com/v1/room/modesttim`).then(data => data.json()),
			fetch(`https://api.frankerfacez.com/v1/set/global`).then(data => data.json()),
			// @ts-ignore
			fetch(`https://api.twitch.tv/kraken/chat/emoticon_images?client_id=${this.state.client_id}&emotesets=${this.state.emote_sets.map(emote => emote.sets).flat(1).join(",")}`).then(data => data.json()),
		]);

		emotes.map(data => {
			switch (true) {
				// Twitch Direct
				case !!data.emoticon_sets:
				Object.keys(data.emoticon_sets).map(i => {
					let emotes: any = data.emoticon_sets[i];
					emotes.map(({ id, code }) => {
						this.setState({ emotes: { ...this.state.emotes, [code]: {
							set: i,
							provider: "twitch",
							src: `https://static-cdn.jtvnw.net/emoticons/v1/${id}/1.0`
						}}})
					})
				})
				break;

				// BetterTTV
				case !!data.emotes && !!data.urlTemplate:
				data.emotes.map(({ code, id }) => {
					this.setState({ emotes: { ...this.state.emotes, [code]: {
						provider: "betterttv",
						src: `https://cdn.betterttv.net/emote/${id}/1x`
					}}})
				});
				break;

				// FrankerFaceZ
				case !!data.sets:
				Object.keys(data.sets).map(v => {
					let emoticons: any = data.sets[v].emoticons;
					emoticons.map(({ name, urls }) => {
						if (!urls["1"]) return;
						this.setState({ emotes: { ...this.state.emotes, [name]: {
							provider: "frankerfacez",
							src: urls["1"]
						}}})
					})
				})
				break;
			}
		});
	}

	private processMsg(message: string): string {
		let msg: string = "";
		// Remove HTML
		let dummy: HTMLDivElement = document.createElement("div");
		dummy.innerHTML = message;
		msg = dummy.innerText;
		// Process
		msg = this.hyperlink(msg);
		msg = this.mentions(msg);
		msg = this.emotes(msg);
		return msg;
	}

	private emotes(msg: string): string {
		const { emotes } = this.state;
		let words = msg.split(" ").map(word => {
			if (!emotes[word]) return word;
			return `<img src="${emotes[word].src}" title="${word}" alt="${word}" />`;
		})
		return words.join(" ");
	}

	private mentions(msg: string): string {
		const { username } = this.state;
		if (username == null) return msg;

		let lowerName: string = username.toLowerCase();
		let words: string[] = msg.split(" ").map(word => {
			if (lowerName != word) return word;
			return `<span class="tag">${lowerName}</span>`;
		})
		return words.join(" ");
	}

	private hyperlink(msg: string): string {
		return msg.replace(/(https?:\/\/[^\s]+)/g, "<a href='$1' target='_blank'>$1</a>");
	}

	private sendMsg(e: React.KeyboardEvent<HTMLInputElement>): void {
		let target: any = e.target;
		
		let colons: number = 0;
		let letters: string[] = target.value.split("");
		letters.map((letter: string, i: number) => {
			if (letter == ":")
				if (letters[i-1] == " " || typeof letters[i-1] == "undefined") colons++
		});
		if (colons % 2 == 0) this.setState({ emoteSearching: false, emoteMenuOpen: false })
		else this.setState({ emoteSearching: true, emoteMenuOpen: true })

		if (this.state.emoteSearching) {
			let search: string = target.value.split(":").reverse()[0];
			return this.setState({ emoteMenuOpen: search.length >= 1, emoteSearch: search })
		} else this.setState({ emoteMenuOpen: false, emoteSearch: "" })

		if (e.key !== 'Enter') return;
		let msg: string = target.value;
		target.value = "";

		if (msg.length > 0) this.state.client.send(JSON.stringify({
			type: "LISTEN",
			data: {
				topics: [msg == "/chatters" ? "chatters" : "chat.send"],
				data: msg
			}
		}));
	}

	private addEmote(emote: string): void {
		let chatInput: any = this.refs.chatInput;

		if (this.state.emoteSearching) {
			chatInput.value = chatInput.value.replace(`:${this.state.emoteSearch}`, emote);
			this.setState({ emoteMenuOpen: false, emoteSearching: false,  emoteSearch: "" });
		} else chatInput.value += `${emote}`;
	}

	private emoteSearch(): HTMLElement {
		let emoteSearched: any = Object.keys(this.state.emotes).filter((emote: string) => emote.toLowerCase().indexOf(this.state.emoteSearch.toLowerCase()) !== -1);
		if (emoteSearched.length === 1) {
			this.addEmote(emoteSearched[0]);
			return null;
		}
		return emoteSearched.map((emote: any) => <img src={this.state.emotes[emote].src} alt="" className="emote" key={"search" + emote} onClick={() => this.addEmote(emote)} />)
	}

	render() {
		const { isChatOnly, isChatHidden } = this.props;
		const { emoteSearching, emoteSearch, emoteMenuSelected, emotes, emote_sets, emoteMenuOpen, chat, viewers, spotify } = this.state;
		return (
			<div className={`chat ${isChatOnly && 'isChatOnly'} ${isChatHidden && 'isChatHidden'}`}>
				<Spotify song={spotify} />
				<div className="viewers">Viewers: {viewers}</div>
				<div className="messages" ref="messages">
					{chat.map((msg, i) => (
						<p key={i} className={msg.action ? "action" : ""}>
							<span className="time">{msg.ts.toLocaleTimeString()}</span>
							{msg.username && <span className="username" data-name={msg.username}>{msg.username.replace(/^\w/, c => { return c.toUpperCase() })}</span>}
							<span className="message" dangerouslySetInnerHTML={{__html: msg.message}}></span>
						</p>
					))}
				</div>
				{emoteMenuOpen && <>
					{emoteSearching && emoteSearch.length >= 1 && <div className="emoteMenu search">{this.emoteSearch()}</div>}
					{!emoteSearching && <div className="emoteMenu">
						{emote_sets.map(group => (
							group.name != "Global" &&
							group.name != "Prime" &&
							group.name != "Pride" &&
							emoteMenuSelected == 0 &&
							<div className="emoteMenuGroup" key={group.name}>
								<p className="emoteMenuHeader">Twitch {group.name}</p>
								{Object.keys(emotes).map((emote) =>
									emotes[emote].provider === "twitch" &&
									group.sets.indexOf(+emotes[emote].set) != -1 &&
									<img src={emotes[emote].src} alt="" className="emote" key={group.name + emote} onClick={() => this.addEmote(emote)} />
								)}
							</div>
						))}
						{emoteMenuSelected == 1 && <div className="emoteMenuGroup">
							<p className="emoteMenuHeader">FrankerFaceZ</p>
							{Object.keys(emotes).map((emote) =>
								emotes[emote].provider === "frankerfacez" &&
								<img src={emotes[emote].src} alt="" className="emote" key={"ffz" + emote} onClick={() => this.addEmote(emote)} />
							)}
						</div>}
						{emoteMenuSelected == 2 && <div className="emoteMenuGroup">
							<p className="emoteMenuHeader">BetterTTV</p>
							{Object.keys(emotes).map((emote) =>
								emotes[emote].provider === "betterttv" &&
								<img src={emotes[emote].src} alt="" className="emote" key={"bttv" + emote} onClick={() => this.addEmote(emote)} />
							)}
						</div>}
						{emote_sets.map(group => (
							(group.name == "Global" || group.name == "Prime" || group.name == "Pride") &&
							emoteMenuSelected == 3 &&
							<div className="emoteMenuGroup" key={group.name}>
								<p className="emoteMenuHeader">Twitch {group.name}</p>
								{Object.keys(emotes).map((emote) =>
									emotes[emote].provider === "twitch" &&
									group.sets.indexOf(+emotes[emote].set) != -1 &&
									<img src={emotes[emote].src} alt="" className="emote" key={"t" + group.name + emote} onClick={() => this.addEmote(emote)} />
								)}
							</div>
						))}
					</div>}
					{emoteSearching && <div className="emoteProviders search">Searching for <span>{emoteSearch}</span></div>}
					{!emoteSearching && <div className="emoteProviders">
						<div className={`emoteProvider${emoteMenuSelected == 0 ? " active" : ""}`} onClick={() => this.setState({ emoteMenuSelected: 0 })}>
							<img className="emoteProviderLogo" src="https://timcole.me/static/logo.png" />
						</div>
						<div className={`emoteProvider${emoteMenuSelected == 1 ? " active" : ""}`} onClick={() => this.setState({ emoteMenuSelected: 1 })}>
							<img className="emoteProviderLogo" src="https://frankerfacez.com/static/images/favicon-32.png" />
						</div>
						<div className={`emoteProvider${emoteMenuSelected == 2 ? " active" : ""}`} onClick={() => this.setState({ emoteMenuSelected: 2 })}>
							<img className="emoteProviderLogo" src="https://manage.betterttv.net/img/favicon.png" />
						</div>
						<div className={`emoteProvider${emoteMenuSelected == 3 ? " active" : ""}`} onClick={() => this.setState({ emoteMenuSelected: 3 })}>
							<img className="emoteProviderLogo" src="https://www.twitch.tv/favicon.ico" />
						</div>
					</div>}
				</>}
				<img className={`emoteMenuButton ${emoteMenuOpen ? "active" : ""}`}
					onClick={() => this.setState({ emoteMenuOpen: !emoteMenuOpen })}
					src="https://static-cdn.jtvnw.net/jtv_user_pictures/chansub-global-emoticon-ebf60cd72f7aa600-24x18.png" alt="Emotes" />
				<input ref="chatInput" className="sendMsg" type="text" onKeyUp={this.sendMsg} />
			</div>
		)
	}
};

export default Chat;
