<template>
	<div id="app">
		<router-view class="page"></router-view>
	</div>
</template>

<script>
import { print } from 'graphql/language/printer';
import meQuery from "./queries/me.gql"

export default {
	name: 'Main',
	async created () {
		this.$store.state.me = await this.graphql(print(meQuery)).then(data => data)
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