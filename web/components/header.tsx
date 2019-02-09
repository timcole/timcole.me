import * as React from "react";
import Link from 'next/link'

import "../styles/header.scss";

interface ILink {
	href: string
	name: string
}

class Header extends React.Component<any> {
	private links: ILink[] = [
		{href: "/", name: "Home"},
		{href: "/videos", name: "VODs"},
	];

	render() {
		return (
			<div id="Header" className={this.props.className}>
				<div className="left">
					<Link href="/"><img src="https://cdn.tcole.me/logo.png" alt="Timothy Cole Logo" /></Link>
					<Link href="/"><h4>Timothy Cole</h4></Link>
				</div>
				<div className="right">
					<ul>
						{this.links.map((link: ILink) => <li key={link.name}><Link href={link.href}><a>{link.name}</a></Link></li> )}
					</ul>
					<div className="subscribe" id="show-modal">Subscribe</div>
				</div>
			</div>
		)
	}
};

export default Header;