import * as React from "react";
import Link from 'next/link'

import "../styles/header.scss";

interface ILink {
	href: string
	name: string
}

class Header extends React.Component {
	private links: ILink[] = [
		{href: "/", name: "Home"},
		{href: "/videos", name: "VODs"},
	];

	render() {
		return (
			<div id="Header">
				<div className="left">
					<Link href="/"><img src="https://cdn.tcole.me/logo.png" alt="Timothy Cole Logo" /></Link>
					<Link href="/"><h4>Timothy Cole</h4></Link>
				</div>
				<div className="right">
					<ul>
						{this.links.map((link: ILink) => <li><Link href={`${link.name}`}><a>{link.name}</a></Link></li> )}
					</ul>
					{/* <div class="subscribe" id="show-modal" click="showSubscribe = true" > Subscribe</div>
					<SubscribeModal v-if="showSubscribe" close="showSubscribe = false" ></SubscribeModal> */}
				</div>
			</div>
		)
	}
};

export default Header;