import Head from 'next/head'

import "../styles/app.scss"
import Header from "./header";

const defaultTitle = `Full Stack Developer - Timothy Cole`;
export default ({ children, title = defaultTitle }) => (
	<div>
		<Head>
			<meta name="viewport" content="width=device-width, initial-scale=1.0" />
			<meta http-equiv="X-UA-Compatible" content="ie=edge" />
			<link rel="shortcut icon" href="assets/logo.png" type="image/x-icon" />
			<title>{title}</title>

			<meta name="keywords" content="Full Stack Developer, Web Developer, Programmer" />
			<meta name="description" content="Timothy Cole - Full Stack Developer" />
			<meta name="author" content="Timothy Cole" />
			<meta name="copyright" content="Timothy Cole" />
			<meta name="rating" content="General" />
			<meta name="google-site-verification" content="tfDdSA0Qb_2Rai1uJibOBXYekD84qIhhh4w9rRGTI_Q" />
			<meta name='url' content="https://timcole.me" />
			<meta name="twitter:creator" content="@ModestTim" />

			<link rel="dns-prefetch" href="https://cdn.tcole.me/" />
			<link rel="dns-prefetch" href="https://gql.twitch.tv/" />
			<link rel="dns-prefetch" href="https://api.twitch.tv/" />
			<link rel="dns-prefetch" href="https://static-cdn.jtvnw.net/" />
			<link rel="preload" href="https://cdn.tcole.me/logo.png" as="image" />
			<link rel="preload" href="https://cdn.tcole.me/setup-compressed.jpg" as="image" />
		</Head>
		<Header />

		{children}

		<footer>{'I\'m here to stay'}</footer>
	</div>
);