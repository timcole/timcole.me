import { GraphQLClient } from 'graphql-request';
const _TWITCH_CLIENT_ID = "xbxtltofdtemb8hkchrsc1ijukifp0";

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