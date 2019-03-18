import * as React from "react";

import "../styles/repo.scss"

class Repo extends React.Component<any> {
	render () {
		const { info } = this.props;
		return (
			<div className="repo">
				<h5>{info.name}</h5>
				<p>{info.desc}</p>
				<span className={`lang ${info.lang.toLowerCase()}`}>{info.lang}</span>
			</div>
		)
	}
}

export default Repo;