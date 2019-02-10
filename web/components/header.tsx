import { Component, Children, cloneElement } from "react";
import { withRouter } from "next/router";
import Link from 'next/link'

import "../styles/header.scss";

interface ILink {
	href: string
	name: string
}
 
// Credit to https://gist.github.com/remy/0dde38897d6d660f0b63867c2344fb59#gistcomment-2393414
const ActiveLink = withRouter(({ router, children, ...props }: any) => (
	<Link {...props}>
		{cloneElement(Children.only(children), {
			className: `/${router.pathname.split("/")[1]}` === props.href ? `router-link-exact-active` : null
		})}
	</Link>
));

class Header extends Component<any> {
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
						{this.links.map((link: ILink) => <li key={link.name}><ActiveLink href={link.href}><a>{link.name}</a></ActiveLink></li> )}
					</ul>
					<div className="subscribe" id="show-modal">Subscribe</div>
				</div>
			</div>
		)
	}
};

export default Header;