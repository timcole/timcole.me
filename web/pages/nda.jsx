import React, { Component } from 'react';

import dynamic from 'next/dynamic';
const VideoPlayer = dynamic(() => import('../components/videoplayer'), { ssr: false })
const Chat = dynamic(() => import('../components/chat'), { ssr: false })

import Layout from '../components/layout'
import Header from '../components/header'

import '../styles/nda.scss'
 
class NDA extends Component {
	constructor (props) {
		super(props)

		this.store = props.store
		this.state = {
			isNDA: false,
			authorization: null
		}
	}

	componentDidUpdate () { this._checkAuth(); }
	componentDidMount () { this._checkAuth(); }
	async _checkAuth () {
		const { authorization } = this.state;
		if (authorization == "") return;

		const ok = (await fetch("https://timcole.me/api/nda/ping", {
			headers: { "Authorization": localStorage.getItem("Authorization") }
		}).then(data => data.text()));
		this.setState({ isNDA: ok === "ok" })
	}

	render() {
		const { authorization, isNDA } = this.state;
		if (!isNDA) return (<>no</>);

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