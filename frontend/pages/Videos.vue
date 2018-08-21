<template>
	<div id="Videos">
		<div class="header"><Header class="container"></Header></div>
		<div class="videos container" v-if="twitch && twitch.user.videos.totalCount > 0">
			<div class="video" v-for="stream in twitch.user.videos.edges" v-bind:key="stream.node.id">
				<a :href="`https://www.twitch.tv/videos/${stream.node.id}`" target="_blank">
					<img class="thumbnail" :src="stream.node.previewThumbnailURL.replace('{width}', '1280').replace('{height}', '720')" alt="" />
					<div class="meta">
						<h2>{{ stream.node.title }}</h2>
						<p>{{ new Date(stream.node.createdAt).toLocaleString() }}</p>
					</div>
				</a>
			</div>
		</div>
		<Footer></Footer>
	</div>
</template>

<script>
export default {
	name: "Videos",
	computed: {
		twitch () { return this.$store.state.me }
	}
}
</script>

<style lang="scss" scoped>
	#Videos {
		background: #2b2e39;

		.header {
			background: rgba(#242730, 0.8);
			-webkit-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.25);
			-moz-box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.25);
			box-shadow: 0px 3px 5px 0px rgba(0,0,0,0.25);
		}

		.videos {
			padding-top: 15px;
			display: grid;
			grid-template-columns: 25% 25% 25% 25%;
			grid-auto-flow: row;

			@media only screen and (max-width: 1000px) {
				grid-template-columns: 50% 50%;
			}

			@media only screen and (max-width: 550px) {
				grid-template-columns: 100%;
			}

			.video {
				margin: 10px;
				-webkit-box-shadow: 0px 5px 10px 0px rgba(0,0,0,.25);
				-moz-box-shadow: 0px 5px 10px 0px rgba(0,0,0,.25);
				box-shadow: 0px 5px 10px 0px rgba(0,0,0,.25);

				a {
					color: inherit;
					text-decoration: none;

					&:focus {
						outline: none;
					}
				}
				&:hover {
					-webkit-box-shadow: 0px 5px 10px 0px rgba(0,0,0,.7);
					-moz-box-shadow: 0px 5px 10px 0px rgba(0,0,0,.7);
					box-shadow: 0px 5px 10px 0px rgba(0,0,0,.7);
				}

				img.thumbnail {
					display: block;
					width: 100%;
					height: auto;
				}

				div.meta {
					background: darken(#2b2e39, 3%);

					h2 {
						margin: 0;
						font-size: 0.9rem;
						font-weight: 600;
						padding: 5px 8px;
						text-overflow: ellipsis;
						white-space: nowrap;
    					overflow: hidden;
					}

					p {
						// text-align: right;
						font-size: 0.8rem;
						padding: 5px 8px;
						margin: 0;
					}
				}
			}
		}
	}
</style>

