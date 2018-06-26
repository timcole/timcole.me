<template>
	<div id="Videos">
		<div class="header"><Header class="container"></Header></div>
		<div class="container">
			<h2>I still need to finish this page lol</h2>
		</div>
		<div class="videos container" v-if="twitch && twitch.data.user.videos.totalCount > 0">
			<div class="video" v-for="stream in twitch.data.user.videos.edges" v-bind:key="stream.node.id">
				<img class="thumbnail" :src="stream.node.previewThumbnailURL.replace('{width}', '1280').replace('{height}', '720')" alt="" />
				{{ stream.node.title }}
			</div>
		</div>
		<Footer></Footer>
	</div>
</template>

<script>
export default {
	name: "Videos",
	computed: {
		twitch () {
			return this.$store.getters.getCache("twitch")
		}
	}
}
</script>

<style lang="scss" scoped>
	#Videos {
		background: #2b2e39;

		.header {
			background: rgba(#242730, 0.8);
		}

		.videos {
			display: flex;

			.video {
				display: inline-block;
				padding: 10px;
				width: 25%;

				img.thumbnail {
					display: block;
					width: 100%;
					height: auto;
				}
			}
		}
	}
</style>

