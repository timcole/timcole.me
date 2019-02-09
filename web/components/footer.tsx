import * as React from "react";

import "../styles/footer.scss";

class Footer extends React.Component {
	private start: String = "1997";
	private end: String = (new Date()).getFullYear().toString();
	private odds: Boolean = Math.random() < 0.5;
	private version: String = "not implemented yet";

	render() {
		return (
			<p className="footer">
				Copyright &copy; {this.start}-{this.end} -
				Timothy Cole - All Rights Reserved. &mdash;
				<a href="https://github.com/TimothyCole/timcole.me" target="_blank">{ this.odds ? "Fork": "Star" } on Github</a> -
				Commit <span>{this.version}</span>
			</p>
		)
	}
};

export default Footer;