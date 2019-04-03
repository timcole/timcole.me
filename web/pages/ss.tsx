import { Component } from 'react';
import { withRouter } from 'next/router';
import fetch from 'node-fetch';

import Layout from '../components/layout'
import Header from '../components/header'
import Footer from '../components/footer'

import Error from './_error';

import '../styles/screenshot.scss'

class Screenshot extends Component<any> {
	private store: any
	constructor (props: any) {
		super(props)

		this.store = props.store
	}

	imageLink (image: string): string {
		return `https://cdn.tcole.me/${image}`;
	}

	static async getInitialProps({ res }) {
		if (!res) return

		var ss = await fetch(`https://cdn.tcole.me/${res.req.params.screenshot}`)

		if (ss.status != 404) return { error: false };

		res.statusCode = 404;
		return { error: res.statusCode };
	}

	render () {
		const { router, error } = this.props
		if (error) return <Error statusCode="404" />;
		return (
			<Layout title={`Timothy Cole - Screenshot: ${router.query.screenshot}`} screenshot={router.query.screenshot} className="screenshot">
				<div className="header"><Header className="container" store={this.store} /></div>
				<div className="body">
					<a href={this.imageLink(router.query.screenshot)}>
						<img src={this.imageLink(router.query.screenshot)} alt="Screenshot" />
					</a>
				</div>
				<Footer />
			</Layout>
		)
	}
}

export default withRouter(Screenshot);