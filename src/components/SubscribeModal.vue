<template>
	<transition name="modal" v-if="twitch">
		<div class="modal-mask" @click="$emit('close')">
			<div class="modal-wrapper">
				<div class="modal-container" @click.stop>
					<p style="display: none;">{{ product = twitch.data.user.subscriptionProducts[selected] }}</p>
					<div class="modal-header">
						<h2>{{ product.displayName }}</h2>
						<div v-on:click="popout(product.url)">Continue to Twitch</div>
					</div>

					<div class="modal-body">
						<div class="left">
							<h4>Subscription benefits</h4>
							<ul>
								<li>Directly support the broadcaster</li>
								<li v-if="product.hasAdFree">Ad-free (with limited exceptions)</li>
								<li>Chat during subscriber-only mode</li>
								<li v-if="product.hasFastChat">Not affected by chat slow mode</li>
							</ul>
						</div>
						<div class="right">
							<h5>Subscriber Badges:</h5>
							<div v-for="badge in twitch.data.user.broadcastBadges" v-if="badge.setID == 'subscriber'" v-bind:key="badge.imageURL" class="ToolTipContainer">
								<img :src="badge.imageURL.replace('/1', '/3')" :alt="badge.description" />
								<ToolTip direction="badges"><p>{{ badge.description }}</p></ToolTip>
							</div>

							<h5>{{ emotes.length }} Subscriber Emote:</h5>
							<div v-for="emote in emotes" v-bind:key="emote.id" class="ToolTipContainer">
								<img :src="`https://static-cdn.jtvnw.net/emoticons/v1/${emote.id}/4.0`" :alt="emote.token" />
								<ToolTip direction="badges"><p>{{ emote.token }}</p></ToolTip>
							</div>
						</div>
					</div>

					<div class="modal-footer">
						<div class="type" :class="{ active: selected == index }" v-for="(product, index) in twitch.data.user.subscriptionProducts" v-bind:key="index" v-on:click="selected = index">
							<p>Tier {{ index + 1 }} <span v-text="product.price"></span></p>
						</div>
					</div>
				</div>
			</div>
		</div>
	</transition>
</template>

<script>
export default {
	name: 'SubscribeModal',
	data () {
		return {
			selected: 0
		}
	},
	methods: {
		popout (url) {
			window.open(url, "_blank", [
				"toolbar=no",
				"scrollbars=yes",
				"resizable=yes",
				"width=1200",
				"height=870"
			].join(","));
		}
	},
	computed: {
		twitch () {
			return this.$store.getters.getCache("twitch")
		},
		emotes () {
			var emotes = []

			for (const [i, tier] of this.twitch.data.user.subscriptionProducts.entries()) {
				if (i > this.selected) break;
				emotes.push(...tier.emotes)
			}

			return emotes
		}
	}
}
</script>

<style lang="scss" scoped>
.modal-mask {
	position: fixed;
	z-index: 9001;
	top: 0;
	left: 0;
	width: 100%;
	height: 100%;
	background: rgba(50,59,72,0.9);
	background: linear-gradient(-55deg, rgba(36,39,48,0.75) 0%, rgba(50,59,72,0.75) 100%);
	display: table;
	transition: opacity .025s ease;

	.modal-wrapper {
		display: table-cell;
		vertical-align: middle;

		.modal-container {
			max-width: 650px;
			margin: 0px auto;
			background-color: rgba(36, 39, 48, 0.9);
			border-radius: 2px;
			box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
			transition: all .1s ease;

			.modal-header {
				display: flex;
				padding: 15px 0 0 15px;

				h2 {
					margin: 0;
					font-weight: 100;
					flex: 2 0px;
				}

				div {
					display: inline-block;
					padding: 10px 20px;
					margin: -4px 10px 0 0;
					border-radius: 4px;
					font-weight: 400;
					font-size: 0.8em;
					background: rgb(48,139,205);
					background: linear-gradient(49deg, rgba(48,139,205,1) 0%, rgba(163,81,181,1) 100%);
					vertical-align: middle;
					color: #dfebf5;
					cursor: pointer;

					&:hover {
						cursor: pointer;
						transition: background 0.5s ease;
						background: linear-gradient(-49deg, rgba(163,81,181,1) 0%, rgba(48,139,205,1) 100%);;
					}
				}
			}

			.modal-body {
				position: relative;
				display: flex;
				padding: 0 20px 10px 20px;

				.left {
					order: 1;
					width: 60%;
				}

				h4, h5 {
					margin-bottom: 10px;
				}

				ul {
					margin-top: 0;
					list-style: none;
					padding-left: 10px;

					li:before {
						content: "- ";
						text-indent: 5px;
					}
				}

				.right {
					order: 2;
					width: 40%;
				}

				.ToolTipContainer {
					position: relative;
					display: inline-block;

					img {
						height: 22px;
						padding-right: 5px;
					}

					p {
						margin: 0;
						padding: 8px 10px;
					}
				}
			}

			.modal-footer {
				display: flex;

				div.type {
					flex: 1;
					display: inline-block;
					text-align: center;
					background: rgba(50,59,72,0.35);
					cursor: pointer;

					&.active {
						cursor: default;
						color: #dfebf5;
						font-weight: 400;
						background: rgb(48,139,205);
						background: linear-gradient(133deg, rgba(48,139,205,1) 0%, rgba(81,181,156,1) 100%);
					}

					&:hover:not(.active) {
						background: rgba(50,59,72,0.5);
					}

					span {
						font-size: 0.75em;
						vertical-align: middle;
						background: rgba(36,39,48,0.5);
						padding: 2px 5px;
						margin-left: 10px;
						border-radius: 3px;
						color: lighten(#aabccb, 5%);
					}
				}
			}

			.modal-enter, .modal-leave-active {
				opacity: 0;
			}

			.modal-enter .modal-container,
			.modal-leave-active .modal-container {
				-webkit-transform: scale(1.1);
				transform: scale(1.1);
			}
		}
	}
}

</style>