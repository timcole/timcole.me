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
			username: ""
		}
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

	processMsg (message) {
		let msg = "";
		let dummy = document.createElement("div");
		dummy.innerHTML = message;
		msg = dummy.innerText;
		msg = this.mentions(msg);
		msg = this.hyperlink(msg);
		return msg;
	}

	mentions (msg) {
		const { username } = this.state;
		if (username == null) return msg;

		let reg = new RegExp(username, 'ig');
		if (!reg.test(msg)) return msg;

		return msg.replace(reg, `<span class="tag">${username}</span>`);
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

	render () {
		const { isChatOnly } = this.props;
		const { chat, viewers } = this.state;
		return (
			<div className={`chat ${isChatOnly ? 'isChatOnly' : ''}`}>
				<Spotify />
				<div className="viewers">Viewers: {viewers}</div>
				<div className="messages" ref="messages">
					{chat.map((msg, i) => (
						<p key={i}>
							<span className="time">{msg.ts.toLocaleTimeString()}</span>
							{msg.username ? <span className="username" data-name={msg.username}>{msg.username}</span> : ''}
							<span className="message" dangerouslySetInnerHTML={{__html: msg.message}}></span>
						</p>
					))}
				</div>
				<input className="sendMsg" type="text" onKeyPress={this.sendMsg} />
			</div>
		)
	}
};

export default Chat;