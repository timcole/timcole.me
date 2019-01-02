<template>
	<div id="Videos">
		<div class="header"><Header class="container"></Header></div>
		<div class="videos container" v-if="videos">
			<div class="video" v-for="video in videos" v-bind:key="video.id">
				<a :href="video.platform == 'twitch' ? `https://www.twitch.tv/videos/${video.id}` : `https://youtu.be/${video.id}`" target="_blank">
					<icon :class="['platform', video.platform]" :icon="['fab', video.platform]"></icon>
					<img class="thumbnail" :src="video.thumbnail" v-on:error="liveThumbnail(video)" alt="" />
					<div class="meta">
						<h2>{{ video.title }}</h2>
						<p>{{ new Date(video.uploaded).toLocaleString() }}</p>
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
	data () {
		return {
			youtube_key: "AIzaSyACVkll8lU0-hN2kcwqCM1BZrX_S6RFkPM",
			youtube_uploads_playlist: "UULvM67Ey6kNCasyEV2dvrbA",
			youtube_uploads: []
		}
	},
	async created () {
		const api_url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${this.youtube_uploads_playlist}&key=${this.youtube_key}&maxResults=50`;
		this.youtube_uploads = (await fetch(api_url).then(data => data.json())).items;
	},
	methods: {
		liveThumbnail (video) {
			this.twitch.user.videos.edges[video.index].node.previewThumbnailURL = "https://static-cdn.jtvnw.net/previews-ttv/live_user_modesttim-1280x720.jpg";
			console.log(index)
		}
	},
	computed: {
		twitch () { return this.$store.state.me },
		videos () {
			// Create a list of videos
			let v = [];

			// Serialize YouTube Videos
			for (let i = 0; i < this.youtube_uploads.length; i++) {
				if (!this.youtube_uploads[i].snippet) continue;
				const vid = this.youtube_uploads[i].snippet;

				v.push({
					uploaded: vid.publishedAt,
					platform: "youtube",
					index: i,
					id: vid.resourceId.videoId,
					title: vid.title,
					// thumbnail: vid.thumbnails.high.url
					thumbnail: `http://img.youtube.com/vi/${vid.resourceId.videoId}/mqdefault.jpg`
				});
			}

			// Serialize Twitch Videos
			if (!this.twitch) return v;
			for (let i = 0; i < this.twitch.user.videos.edges.length; i++) {
				if (!this.twitch.user.videos.edges[i].node) continue;
				const vid = this.twitch.user.videos.edges[i].node;

				v.push({
					uploaded: vid.createdAt,
					platform: "twitch",
					index: i,
					id: vid.id,
					title: vid.title,
					thumbnail: vid.previewThumbnailURL.replace("{width}", "1280").replace("{height}", "720")
				});
			}

			// Sort the array newest to oldest
			v.sort((a, b) => {
				return new Date(b.uploaded) - new Date(a.uploaded);
			});

			// Return our sorted set
			return v;
		}
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
				position: relative;

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

				svg.platform {
					position: absolute;
					font-size: 1.75em;
					top: 8px;
					right: 10px;
					-webkit-filter: drop-shadow(0 2px 5px rgba(#000000, 0.35));
					filter: drop-shadow(0 2px 5px rgba(#000000, 0.35));

					&.youtube { color: #ff0000; }
					&.twitch { color: #6441A4; }
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

