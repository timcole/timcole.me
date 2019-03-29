import * as React from "react";

import "../styles/chat.scss";

class Chat extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			connected: false,
			client: null,
			mounted: false,
			chat: [],
			viewers: 0
		}
	}

	componentDidMount() { this.connectToChat(); }
	connectToChat () {
		this.url = this.props.isDev ? "ws://127.0.0.1:6969/ws" : "wss://timcole.me/ws";
		let client = new WebSocket(`${this.url}?authorization=${this.props.authorization}`);
		this.setState({ client })

		client.onopen = () => {
			this.setState({ connected: true });
			console.log('Chat Connected');
			client.send(`{"type":"LISTEN","data":{"topics":["chat.receive","chat.viewers"]}}`);
		}

		client.onmessage = ({ data: wsData }) => {
			let { data: { topics, data: msg } } = JSON.parse(wsData);
			if (!msg) return;

			if (topics == "chat.viewers") this.setState({ viewers: msg })

			if (topics == "chat.receive") {
				msg.ts = new Date();
				msg.message = this.processMsg(msg.message);
				this.setState({ chat: [...this.state.chat, msg] });

				const { messages } = this.refs;
				if (messages) messages.scrollTop = messages.scrollHeight;
			}
		}
		this.sendMsg = this.sendMsg.bind(this);
	}

	processMsg (message) {
		let msg = "";
		let dummy = document.createElement("div");
		dummy.innerHTML = message;
		msg = dummy.innerText;
		msg = this.hyperlink(msg);
		return msg;
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
		const { chat, viewers } = this.state;
		return (
			<div className="chat">
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