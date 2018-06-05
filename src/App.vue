<template>
	<div id="app">
		<router-view class="page"></router-view>
		<TheModestLand></TheModestLand>
	</div>
</template>

<script>
export default {
	name: 'Main',
	data () {
		return {}
	},
	async created () {
		const twitch = {"query":"query {\n\tuser(login: \"modesttim\") {\n\t\tid\n\t\tlogin\n\t\tdisplayName\n\t\tfollowers {\n\t\t\ttotalCount\n\t\t}\n\t\tbroadcastSettings {\n\t\t\tgame {\n\t\t\t\tid\n\t\t\t\tname\n\t\t\t\tdisplayName\n\t\t\t\tboxArtURL\n\t\t\t}\n\t\t\ttitle\n\t\t}\n\t\tstream {\n\t\t\tid\n\t\t\tpreviewImageURL\n\t\t\tviewersCount\n\t\t}\n\t\tbroadcastBadges {\n\t\t\tsetID\n\t\t\tdescription\n\t\t\timageURL\n\t\t}\n\t\tsubscriptionProducts {\n\t\t\tdisplayName\n\t\t\temotes {\n\t\t\t\tid\n\t\t\t\tsetID\n\t\t\t\ttoken\n\t\t\t}\n\t\t\tprice\n\t\t\turl\n\t\t\thasAdFree\n\t\t\thasFastChat\n\t\t}\n\t\tvideos {\n\t\t\ttotalCount\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tid\n\t\t\t\t\ttitle\n\t\t\t\t\tdescription\n\t\t\t\t\tcreatedAt\n\t\t\t\t\tlengthSeconds\n\t\t\t\t\tpreviewThumbnailURL\n\t\t\t\t\tanimatedPreviewURL\n\t\t\t\t\tupvotes\n\t\t\t\t\ttags\n\t\t\t\t\tgame {\n\t\t\t\t\t\tid\n\t\t\t\t\t\tdisplayName\n\t\t\t\t\t\tboxArtURL\n\t\t\t\t\t}\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n}\n "}
		this.$store.commit('gql', { key: "twitch", query: twitch })
	}
}
</script>

<style lang="scss">
	@import url('https://fonts.googleapis.com/css?family=Material+Icons|Roboto:100,300,400,500');
	html, body {
		font-family: 'Roboto', sans-serif;
		font-weight: 100;
		color: #dfebf5;
		height: 100%;
		width: 100%;
		padding: 0;
		margin: 0;
	}

	div#app {
		height: 100%;
		width: 100%;
		display: flex;
		overflow: hidden;

		div.page {
			display: block;
			flex-direction: column;
			width: 100%;
			height: 100%;
			overflow: auto;
			z-index: 1;
		}

		div#TheModestLand {
			z-index: 2;
		}

		div.container {
			max-width: 1275px;
			margin: 0 auto;
		}
	}
</style>