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
	fetch: fetch,
});

class Main extends App {
	constructor(props) {
		super(props)

		this.store.get = this.store.get.bind(this);
		this.store.set = this.store.set.bind(this);
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
					<Component {...pageProps} store={this.store} />
				</ApolloProvider>
			</Container>
		)
	}
}

export default Main