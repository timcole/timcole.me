<template>
	<div id="Stream">
		<div class="header"><Header class="container"></Header></div>
		<div id="stream"></div>
	</div>
</template>

<script>
export default {
	name: "ModestStream",
	data () {
		return { player: null }
	},
	computed: {
		twitch () {
			return this.$store.getters.getCache("twitch")
		}
	},
	created () {
		var embeds = document.createElement("script");
		embeds.setAttribute("src", "https://embed.twitch.tv/embed/v1.js");
		embeds.onload = this.loadStream;
		document.body.appendChild(embeds);
	},
	destroyed () {
		var embed = document.querySelector("script[src='https://embed.twitch.tv/embed/v1.js']");
		if (embed) return embed.remove();
	},
	watch: {
		$route (to, from) { this.loadStream() }
	},
	methods: {
		loadStream() {
			if (this.player) {
				this.player = null
				document.getElementById("stream").innerHTML = '';
			}

			this.player = new Twitch.Embed("stream", {
				width: "100%",
				height: "100%",
				channel: this.$route.params.streamer || "monstercat"
			});
		}
	}
}
</script>

<style lang="scss" scoped>
	#Stream {
		background: #2b2e39;
		height: 100%;
		display: flex !important;
		flex-direction: column;

		.header {
			background: rgba(#242730, 0.8);
		}

		#stream {
			display: flex;
			flex: 2 0px;
		}
	}
</style>

