import { Component } from "react";

import Layout from '../components/layout'
import Header from '../components/header'
import Bio from '../components/bio'
import Socials from '../components/socials'
import Repo from "../components/repo";
import Footer from '../components/footer'

import "../styles/index.scss"

class Index extends Component<any> {
	private store: any
	constructor (props: any) {
		super(props)

		this.store = props.store
	}

	private repos = [
		{ name: "timcole.me", desc: "asdasd asd asd asd asd asd asd", lang: "Go" },
		{ name: "timcole.me", desc: "asdasd asd asd asd asd asd asd", lang: "Go" },
		{ name: "timcole.me", desc: "asdasd asd asd asd asd asd asd", lang: "Go" },
		{ name: "timcole.me", desc: "asdasd asd asd asd asd asd asd", lang: "Go" },
	]

	render() {
		return (
			<Layout className="homepage">
				<div className="header"><Header className="container" store={this.store} /></div>
				<div className="setup"><div className="bio"><Bio className="narrow" /></div></div>
				<Socials className="socials" />
				<div className="container">
					<h1 className="narrow">Pinned Repositories</h1>
					<div className="repos">
						{this.repos.map((repo: {}) => <Repo info={repo} />)}
					</div>
				</div>
				<Footer />
			</Layout>
		)
	}
};

export default Index;