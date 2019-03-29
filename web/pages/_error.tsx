import { Component } from "react";

import Layout from '../components/layout';
import Header from '../components/header';
import Footer from '../components/footer';

import "../styles/_error.scss";

class Error extends Component<any> {
	static getInitialProps({ res, err }) {
		if (err) console.log({ err })
		const statusCode = res ? res.statusCode : err ? err.statusCode : null;
		return { statusCode };
	}

	private store: any
	constructor (props: any) {
		super(props)

		this.store = props.store
	}

	render() {
		return (
			<Layout>
				<div className="_error">
					<div className="header"><Header className="container" store={this.store} /></div>
					<div className="container error">
						<h1>{this.props.statusCode}</h1>
						<h2>{this.props.statusCode == "404" ? "Not Found" : "Error"}</h2>
					</div>
					<Footer />
				</div>
			</Layout>
		)
	}
};

export default Error;