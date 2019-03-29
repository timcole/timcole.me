import App, { Container } from 'next/app'
import React from 'react'

const _TWITCH_CLIENT_ID = "kimne78kx3ncx6brgo4mv6wki5h1ko";
import { ApolloProvider } from 'react-apollo';
import ApolloClient from "apollo-boost";
import fetch from 'node-fetch';
const client = new ApolloClient({
	uri: "https://gql.twitch.tv/gql",
	headers: { "Client-ID": _TWITCH_CLIENT_ID },
	// @ts-ignore
	fetch,
});

import { library } from '@fortawesome/fontawesome-svg-core'
import {
	faTwitch,
	faTwitter,
	faGithub,
	faInstagram,
	faDiscord,
	faYoutube,
	faWindows
} from '@fortawesome/free-brands-svg-icons'
library.add(faTwitch, faTwitter, faGithub, faInstagram, faDiscord, faYoutube); 
import {
	faPlay,
	faPause,
	faCompress,
	faVolumeMute
} from '@fortawesome/free-solid-svg-icons';
library.add(faPlay, faPause, faCompress, faVolumeMute);
import {
	faVolume,
} from '@fortawesome/pro-solid-svg-icons';
library.add(faVolume);

import SubscribeModal from '../components/subscribe_modal';
class Main extends App {
	constructor (props: any) {
		super(props)

		this.store.get = this.store.get.bind(this);
		this.store.set = this.store.set.bind(this);
	}

	state = {
		showSubscribe: false
	}
	private store = {
		get(): {} { return this.state; },
		set(s: any): void { this.setState(s); },
	}

	render() {
		const { Component, pageProps } = this.props
		return (
			<Container>
				<ApolloProvider client={client}>
					{this.state.showSubscribe ? (<SubscribeModal store={this.store} />) : null}
					<Component store={this.store} {...pageProps} />
				</ApolloProvider>
			</Container>
		)
	}
}

export default Main