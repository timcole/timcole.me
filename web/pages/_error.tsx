import * as React from "react";

import Layout from '../components/layout';
import Header from '../components/header';
import Footer from '../components/footer';

import "../styles/_error.scss";

class Error extends React.Component {
	render() {
		return (
			<Layout>
				<div className="_error">
					<div className="header"><Header className="container" /></div>
					<div className="container error">
						<h1>404</h1>
						<h2>Not Found</h2>
					</div>
					<Footer />
				</div>
			</Layout>
		)
	}
};

export default Error;