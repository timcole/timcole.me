import React, { Component } from 'react';

import dynamic from 'next/dynamic';
const VideoPlayer = dynamic(() => import('../components/videoplayer'), { ssr: false })
const Chat = dynamic(() => import('../components/chat'), { ssr: false })

import Layout from '../components/layout'
import Header from '../components/header'
import Footer from '../components/footer'

import '../styles/nda.scss'
 
class NDA extends Component {
	constructor (props) {
		super(props)

		this.store = props.store
		this.state = {
			isNDA: false,
			authorization: null
		}

		this.login = this.login.bind(this);
	}

	componentDidUpdate () { this._checkAuth(); }
	componentDidMount () { this._checkAuth(); }
	async _checkAuth() {
		let { authorization } = this.state;
		let storedAuth = localStorage.getItem("Authorization");
		if (storedAuth == authorization) return;
		authorization = storedAuth
		this.setState({ authorization })

		const authedUrl = "https://timcole.me/api/nda/ping";
		// const authedUrl = "http://127.0.0.1:6969/nda/ping";
		console.log({ authorization })
		const ok = (await fetch(authedUrl, {
			headers: { "Authorization": authorization }
		}).then(data => data.text()));
		this.setState({ isNDA: ok === "ok" })
	}

	updateValue (e) {
		e.target.setAttribute('data-value', e.target.value)
		if (e.keyCode != 13) return;
		if (e.target.dataset.type === "username") document.querySelector('[data-type="password"]').focus();
		// if (e.target.dataset.type === "password") document.querySelector('input[type="submit"]').click();
	}

	async login () {
		let [username, password] = [
			document.querySelector('[data-type="username"]').value,
			document.querySelector('[data-type="password"]').value,
		];
		console.log({username,password})
		if (username == "" || password == "") return;

		const loginUrl = "https://timcole.me/api/login";
		// const loginUrl = "http://127.0.0.1:6969/login";
		const { error, jwt } = (await fetch(loginUrl, {
			method: "POST",
			body: JSON.stringify({ username, password })
		}).then(data => data.json()));
		if (error) return alert(error);
		if (!jwt) return alert("No auth Authorizatione, jwt returned from the server. Try again later.");
		localStorage.setItem("Authorization", jwt);
		this.setState({ Authorization: jwt });
	}

	render () {
		const { authorization, isNDA } = this.state;
		if (!isNDA) return (
			<Layout title={`Timothy Cole - NDA Login`} className="nda-login">
				<div className="header"><Header className="container" store={this.store} /></div>
				<div className="body">
					<h1>Unauthorized</h1>
					<form onSubmit={e => e.preventDefault()} className="login" method="POST">
						<fieldset>
							<input
								data-type="username"
								type="text"
								data-value=""
								onKeyUp={this.updateValue} />
							<hr /><label>Username</label>
						</fieldset>
						<fieldset>
							<input
								data-type="password"
								type="password"
								data-value=""
								onKeyUp={this.updateValue} />
							<hr /><label>Password</label>
						</fieldset>
						<input type="submit" value="Login" onClick={this.login} />
					</form>
					<Footer />
				</div>
			</Layout>
		);

		const options = {
			authorization,
			autoplay: true,
			controls: false,
			hlsConfig: {
				liveSyncPosition: 3000
			}
		};

		return (
			<Layout title={`Timothy Cole - NDA`} className="nda">
				<div className="header"><Header className="container" store={this.store} /></div>
				<div className="body">
					<VideoPlayer { ...options } />
					<Chat authorization={authorization} />
				</div>
			</Layout>
		)
	}
}

export default NDA;