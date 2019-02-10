import { Component } from "react";
import { Query } from "react-apollo";

import Layout from '../components/layout'
import Header from '../components/header'
import Footer from '../components/footer'

import "../styles/videos.scss"

class Videos extends Component<any> {
	render() {
		return (
			<Layout title="Timothy Cole - Stream VODs">
				<div className="videos_page">
					<div className="header"><Header className="container" /></div>
						<Query
							query={videosQuery}
							variables={{ login: "modesttim", limit: 100 }}
						>
						{({ loading, error, data }) => {
							if (loading) return <p>Loading...</p>;
							if (error) return <p>Error :(</p>;
							return (
								<div className="container videos">
									{data.user.videos.edges.map((edge: any) => (
										<div className="video" key={edge.node.id}>
											<a href={`https://www.twitch.tv/videos/${edge.node.id}`} target="_blank">
												<img className="thumbnail" src={edge.node.previewThumbnailURL.replace("{width}", "1280").replace("{height}", "720")} alt={edge.node.title} />
												<div className="meta">
													<h2>{edge.node.title}</h2>
													<p>{new Date(edge.node.createdAt).toLocaleString() }</p>
												</div>
											</a>
										</div>
									))}
								</div>
							)
						}}
						</Query>
					<Footer />
				</div>
			</Layout>
		)
	}
};

import gql from 'graphql-tag';
const videosQuery = gql`
query getUser($login: String) {
	user(login: $login) {
		videos(first: 100) {
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

export default Videos;