import { Component } from "react";

import Layout from '../components/layout'
import Header from '../components/header'
import Bio from '../components/bio'
import Socials from '../components/socials'
import Footer from '../components/footer'

import "../styles/index.scss"

class Index extends Component<any> {
	private store: any
	constructor (props: any) {
		super(props)

		this.store = props.store
	}

	render() {
		return (
			<Layout>
				<div className="page homepage">
					<div className="gradient">
						<Header className="container" store={this.store} />
						<div className="container billboard">
							<Bio className="left" />
							<Socials className="right" />
						</div>
						<Footer />
					</div>
				</div>
			</Layout>
		)
	}
};

export default Index;