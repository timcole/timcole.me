import * as React from "react";

import "../styles/chat.scss";

class Chat extends React.Component {
	constructor(props) {
		super(props);

		this.url = this.props.isDev ? "ws://127.0.0.1:6969/ws" : "wss://timcole.me/ws"
		this.state = {
			connected: false,
			client: new WebSocket(`${this.url}?authorization=${this.props.authorization}`),
			mounted: false,
			chat: []
		}

		this.state.client.onopen = () => {
			this.setState({ connected: true });
			console.log('Chat Connected');
			this.state.client.send(`{"type":"LISTEN","data":{"topics":["chat.receive"]}}`);
		}

		this.state.client.onmessage = ({ data: wsData }) => {
			let { data: { data: msg } } = JSON.parse(wsData);
			if (!msg) return;
			msg.ts = new Date();
			this.setState({ chat: [...this.state.chat, msg] });
		}
		this.sendMsg = this.sendMsg.bind(this);
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
		const { chat } = this.state;
		return (
			<div className="chat">
				<div className="messages">
					{chat.map((msg, i) => (
						<p key={i}>
							<span className="time">{msg.ts.toLocaleTimeString()}</span>
							{msg.username ? <span className="username" data-name={msg.username}>{msg.username}</span> : ''}
							<span className="message">{msg.message}</span>
						</p>
					))}
				</div>
				<input className="sendMsg" type="text" onKeyPress={this.sendMsg} />
			</div>
		)
	}
};

export default Chat;