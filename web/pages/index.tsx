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
			<Layout className="homepage">
				<div className="header"><Header className="container" store={this.store} /></div>
				<div className="setup"><div className="bio"><Bio className="container" /></div></div>
				<Socials className="socials" />
				<Footer />
			</Layout>
		)
	}
};

export default Index;