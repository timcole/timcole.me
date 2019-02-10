import { Component } from "react";
import Head from 'next/head'

import "../styles/app.scss";

const defaultTitle = `Timothy Cole - Software Engineer`;
class Layout extends Component<any> {
	render () {
		const { title, children, screenshot } = this.props
		return (
			<div id="app">
				<Head>
					<meta name="viewport" content="width=device-width, initial-scale=1.0" />
					<meta httpEquiv="X-UA-Compatible" content="ie=edge" />
					<link rel="shortcut icon" href="/static/logo.png" type="image/x-icon" />
					<title>{title || defaultTitle}</title>

					<meta name="keywords" content="Software Engineer, Full Stack Developer, Web Developer, Programmer" />
					<meta name="description" content="Timothy Cole - Software Engineer" />
					<meta name="author" content="Timothy Cole" />
					<meta name="copyright" content="Timothy Cole" />
					<meta name="rating" content="General" />
					<meta name="google-site-verification" content="tfDdSA0Qb_2Rai1uJibOBXYekD84qIhhh4w9rRGTI_Q" />
					<meta name='url' content="https://timcole.me" />
					<meta name="twitter:creator" content="@ModestTim" />
					<meta name="twitter:site" content="@ModestTim" />

					<link rel="dns-prefetch" href="https://cdn.tcole.me/" />
					<link rel="dns-prefetch" href="https://gql.twitch.tv/" />
					<link rel="dns-prefetch" href="https://api.twitch.tv/" />
					<link rel="dns-prefetch" href="https://static-cdn.jtvnw.net/" />
					<link rel="preload" href="https://cdn.tcole.me/logo.png" as="image" />
					<link rel="preload" href="https://cdn.tcole.me/setup-compressed.jpg" as="image" />
				</Head>

				{screenshot ? (
					<Head>
						<meta name="twitter:card" content="photo" />
						<meta name="twitter:title" content={`Screenshot - ${screenshot}`} />
						<meta name="twitter:image" content={`https://cdn.tcole.me/${screenshot}`} />
						<meta name="twitter:url" content={`http://timcole.me/ss/${screenshot}`} />

						<meta property="og:title" content={`Screenshot - ${screenshot}`} />
						<meta property="og:type" content="website" />
						<meta property="og:image" content={`https://cdn.tcole.me/${screenshot}`} />
						<meta property="og:site_name" content="Timothy Cole - Full Stack Developer" />
						<meta property="og:description" content={`Screenshot - ${screenshot}`} />

						<meta itemProp="name" content={`Screenshot - ${screenshot}`} />
						<meta itemProp="description" content={`Screenshot - ${screenshot}`} />
						<meta itemProp="image" content={`https://cdn.tcole.me/${screenshot}`} />

						<meta name="msapplication-starturl" content={`http://timcole.me/ss/${screenshot}`} />
						<meta name="msapplication-TileImage" content={`https://cdn.tcole.me/${screenshot}`} />
						<meta name="msapplication-TileColor" content="#ffffff" />
					</Head>
				) : null}

				{children}
			</div>
		)
	}
};

export default Layout;