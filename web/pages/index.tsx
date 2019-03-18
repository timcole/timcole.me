import { Component } from "react";
import { Query } from "react-apollo";

import Layout from '../components/layout'
import Header from '../components/header'
import Bio from '../components/bio'
import Socials from '../components/socials'
import Repo from "../components/repo";
import Footer from '../components/footer'

import "../styles/index.scss"
import "../styles/videos.scss"

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
				{/* <div className="container">
					<h1 className="narrow">Pinned Repositories</h1>
					<div className="repos">
						{this.repos.map((repo: {}) => <Repo info={repo} />)}
					</div>
				</div> */}
				<div className="container">
					<h1 className="narrow">Twitch VODs</h1>
					<Query
						query={videosQuery}
						variables={{ login: "modesttim", limit: 4 }}
					>
						{({ loading, error, data }) => {
							if (loading) return <p>Loading...</p>;
							if (error) return <p>Error :(</p>;
							return (
								<div className="videos">
									{data.user.videos.edges.map((edge: any) => (
										<div className="video" key={edge.node.id}>
											<a href={`https://www.twitch.tv/videos/${edge.node.id}`} target="_blank">
												<img className="thumbnail" src={edge.node.previewThumbnailURL.replace("{width}", "1280").replace("{height}", "720")} alt={edge.node.title} />
												<div className="meta">
													<h2>{edge.node.title}</h2>
													<p>{new Date(edge.node.createdAt).toLocaleString()}</p>
												</div>
											</a>
										</div>
									))}
								</div>
							)
						}}
					</Query>
				</div>
				<Footer />
			</Layout>
		)
	}
};

export default Index;

import gql from 'graphql-tag';
const videosQuery = gql`
query getUser($login: String, $limit: Int) {
	user(login: $login) {
		videos(first: $limit) {
			totalCount
			edges {
				node {
					id
					title
					description
					createdAt
					lengthSeconds
					previewThumbnailURL
					animatedPreviewURL
					tags
					game {
						id
						displayName
						boxArtURL
					}
				}
			}
		}
	}
}`;