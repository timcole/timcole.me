import { GraphQLClient } from 'graphql-request';
const _TWITCH_CLIENT_ID = "kimne78kx3ncx6brgo4mv6wki5h1ko";

const client = new GraphQLClient('https://gql.twitch.tv/gql', {
	headers: {
		"Client-ID": _TWITCH_CLIENT_ID
	},
})

module.exports = function () {
	return {
		graphql(query) { return client.request(query); }
	}
}
