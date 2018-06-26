<template>
	<div id="TheModestLand" v-if="broadcasters && broadcasters.data.community.streams.edges.length > 0">
		<div class="header ToolTipContainer">
			<img class="avi" draggable="false" src="https://cdn.tcole.me/themodestland.png" alt="The Modest Land">
			<ToolTip direction="left">
				<span>The Modest Land Broadcasts</span>
			</ToolTip>
		</div>
		<div class="broadcasts">
			<p>Live</p>
			<div class="broadcast ToolTipContainer" v-for="broadcast in broadcasters.data.community.streams.edges" v-bind:key="broadcast.id" v-on:click="openStream(broadcast.node.broadcaster.login, true)" @click.middle="openStream(broadcast.node.broadcaster.login, false)">
				<img class="avi" draggable="false" :src="broadcast.node.broadcaster.profileImageURL" :alt="broadcast.node.broadcaster.displayName">
				<div class="indicator">
					<span></span>
					{{ broadcast.node.viewersCount }}
				</div>

				<ToolTip direction="streams">
					<h4>{{ broadcast.node.broadcaster.broadcastSettings.title }}</h4>
					<img class="thumbnail" draggable="false" :src="broadcast.node.previewImageURL.replace('{width}', '1280').replace('{height}', '720')" alt="" />
					<img class="game_art" draggable="false" v-if="broadcast.node.broadcaster.broadcastSettings.game" :src="broadcast.node.broadcaster.broadcastSettings.game.boxArtURL.replace('{width}', '80').replace('{height}', '107')" alt="" />
					<h5>{{ broadcast.node.broadcaster.displayName }}</h5>
				</ToolTip>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	name: 'TheModestLand',
	data () {
		return {
			featured: []
		}
	},
	created () {
		const query = {"query":"query {\n\tcommunity(name: \"programming\") {\n\t\tdisplayName\n\t\tdescription\n\t\trules\n\t\tfollowersCount\n\t\tviewersCount\n\t\tstreams {\n\t\t\tedges {\n\t\t\t\tnode {\n\t\t\t\t\tbroadcaster {\n\t\t\t\t\t\tdisplayName\n\t\t\t\t\t\tlogin\n\t\t\t\t\t\tprofileImageURL(width: 50)\n\t\t\t\t\t\tbroadcastSettings {\n\t\t\t\t\t\t\tgame {\n\t\t\t\t\t\t\t\tboxArtURL\n\t\t\t\t\t\t\t\tdisplayName\n\t\t\t\t\t\t\t\t\n\t\t\t\t\t\t\t}\n\t\t\t\t\t\t\ttitle\n\t\t\t\t\t\t\tlanguage\n\t\t\t\t\t\t\tisMature\n\t\t\t\t\t\t}\n\t\t\t\t\t}\n\t\t\t\t\tviewersCount\n\t\t\t\t\tpreviewImageURL\n\t\t\t\t}\n\t\t\t}\n\t\t}\n\t}\n}\n "}
		this.$store.commit('gql', { key: "modest_streams", query })
	},
	methods: {
		openStream(streamer, current) {
			this.$router.push({
				name: 'ModestStream',
				params: { streamer }
			});
		}
	},
	computed: {
		broadcasters () {
			return this.$store.getters.getCache("modest_streams")
		}
	}
}
</script>

<style lang="scss" scoped>
	$background: #242730;
	$whiteish: #aabccb;

	#TheModestLand {
		max-width: 70px;
		height: 100%;
		max-height: 100%;
		top: 0;
		right: 0;
		background: $background;

		-webkit-box-shadow: 0px 0px 10px 0px rgba(0,0,0,1);
		-moz-box-shadow: 0px 0px 10px 0px rgba(0,0,0,1);
		box-shadow: 0px 0px 10px 0px rgba(0,0,0,1);

		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	img.avi {
		width: 3rem;
		margin: 12px;
	}

	#ToolTipContent span {
		display: inline-block;
		padding: 10px 13px;
	}

	.broadcasts {
		.broadcast {
			position: relative;

			img.avi {
				border-radius: 50%;
				margin: 12px 12px 3px;
				-moz-transition: all 250ms;
				-o-transition: all 250ms;
				-webkit-transition: all 250ms;
				transition: all 250ms;
			}

			&:hover img.avi {
				border-radius: 4px;
			}

			.indicator {
				display: inline-block;
				background-color: #363a48;
				font-size: 0.75em;
				padding: 2px 5px;
				border-radius: 3px;
				position: absolute;
				right: 5px;
				bottom: -1px;
				z-index: 1;

				span {
					display: inline-block;
					width: 10px;
					height: 10px;
					border-radius: 50%;
					background: #963636;
				}
			}

			#ToolTipContent div.container {
				padding: 10px 8px;
				position: relative;

				img.thumbnail {
					border-radius: 0;
					width: 315px;
					margin-bottom: -4px;
				}

				img.game_art {
					position: absolute;
					height: 80px;
					left: 0;
					bottom: 0;
					z-index: 2;
					-webkit-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
					-moz-box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
					box-shadow: 0px 0px 5px 0px rgba(0,0,0,0.75);
				}

				h4, h5 {
					margin: 0;
					white-space: nowrap;
					width: 300px;
					overflow: hidden;
					text-overflow: ellipsis;
				}

				h4 {
					font-size: 0.85em;
					font-weight: 500;
					top: 0;
					background: #363a48;
					padding: 8px;
				}

				h5 {
					position: absolute;
					font-weight: 100;
					bottom: 0;
					right: 0;
					width: calc(100% -6px);
					padding: 3px;
					text-align: right;
					background: #2b2e39;
				}
			}
		}
	}

	p {
		text-align: center;
		margin: 0;
		padding: 0;
		color: darken($whiteish, 10%);
		text-transform: uppercase;
		font-size: 0.8em;

		&::before {
			display: block;
			margin: 0px auto 8px auto;
			content: "";
			height: 1px;
			width: 3rem;
			background: #363a48;
		}
	}
</style>
