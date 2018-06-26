<template>
	<div id="Screenshot">
		<div class="header"><Header class="container"></Header></div>
		<div class="body">
			<a :href="this.$store.getters.cdn(ss)" target="_blank">
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
	created () {
		const ss = this.ss
		const tags = [
			{ name: "twitter:card", content: "photo" },
			{ name: "twitter:site", content: "@ModestTim" },
			{ name: "twitter:title", content: `Screenshot - ${ss}` },
			{ name: "twitter:image", content: this.$store.getters.cdn(ss) },
			{ name: "twitter:url", content: `http://timcole.me/ss/${ss}` },
			{ property: "og:title", content: `Screenshot - ${ss}` },
			{ property: "og:type", content: "website" },
			{ property: "og:image", content: this.$store.getters.cdn(ss) },
			{ property: "og:site_name", content: "Timothy Cole - Full Stack Developer" },
			{ property: "og:description", content: `Screenshot - ${ss}`},
			{ itemprop: "name", content: `Screenshot - ${ss}` },
			{ itemprop: "description", content: `Screenshot - ${ss}` },
			{ itemprop: "image", content: this.$store.getters.cdn(ss) },
			{ name: "msapplication-starturl", content: this.$store.getters.cdn(ss) },
			{ name: "msapplication-TileImage", content: this.$store.getters.cdn(ss) },
			{ name: "msapplication-TileColor", content: "#ffffff"}
		].map(t => { this.AddMetaTag(t) })
	},

	methods: {
		AddMetaTag (tag) {
			var meta = document.createElement('meta');
			if (tag.name) meta.name = tag.name;
			if (tag.property) meta.setAttribute("property", tag.property);
			if (tag.itemprop) meta.setAttribute("itemprop", tag.itemprop);
			if (tag.content) meta.content = tag.content;
			document.getElementsByTagName('head')[0].appendChild(meta);
		},
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
