<template>
	<div id="Screenshot">
		<div class="header"><Header class="container"></Header></div>
		<div class="body">
			<a :href="this.$store.getters.cdn(ss)">
				<img :src="this.$store.getters.cdn(ss)" alt="Screen Shot" @error="NotFound()" />
			</a>
		</div>
		<Footer></Footer>
	</div>
</template>

<script>
export default {
	name: "Screenshot",
	computed: {
		ss () {
			return this.$route.params.screenshot
		}
	},
	methods: {
		NotFound () {
			return this.$router.push('/404');
		}
	}
}
</script>

<style lang="scss" scoped>
	#Screenshot {
		background: #2b2e39;
		height: 100%;

		.header {
			background: rgba(#242730, 0.8);
			-webkit-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.25);
			-moz-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.25);
			box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.25);
		}

		.body {
			text-align: center;
			max-width: 100%;
			padding: 30px 50px;

			img {
				max-width: 100%;
				-webkit-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
				-moz-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
				box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.75);
			}
		}
	}
</style>
