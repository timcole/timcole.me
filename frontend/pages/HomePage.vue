<template>
	<div id="HomePage">
		<div class="gradient">
			<Header class="container"></Header>
			<div class="container billboard">
				<div class="left">
					<h1>About me</h1>

					<p>My name is <b>Timothy Cole</b> or as my parents refer to me, tech support but you can call me <b>Tim</b>!</p>

					<p>I'm a <b>21 year old</b>, self-taught, software engineer living on the coastal side of <b>North Carolina</b>.</p>

					<p>When I was 10 years old I fell in love with computers.  I thought they were so neat that I wanted to become the CEO of Intel one day.  When I was 13 I realized how intriguing websites are so I started to tinker with inspect element.  It wasn't until then when I realized what I wanted to do with my life. A few months passed and I was still learning and investing my time away.</p>

					<p><em>EUREKA!</em> - Finally, by the age of 14, I created my very first website!  All front-end and far from perfect, but it was mine that's all that mattered.  As time passed, I completed many projects, gradually becoming more educated and working harder as ever.</p>

					<p>After hating school for my entire life, I decided to drop out of high school at age 17 to pursue my career as a programmer.</p>

					<p>I'm now fluent with many technologies.  Primarily I write server side code in <a href="https://golang.org/" target="_blank">Go</a>, while storing data in either <a href="https://cloud.google.com/spanner/" target="_blank">Spanner</a> or <a href="https://cloud.google.com/datastore/" target="_blank">Datastore</a> with <a href="https://redis.io/" target="_blank">Redis</a> as a cache.  Typically on the client side of things I use <a href="https://vuejs.org/" target="_blank">Vue.js</a> with the normal bells and whistles like <a href="https://vuex.vuejs.org/" target="_blank">Vuex</a> and <a href="https://router.vuejs.org/" target="_blank">Vue Router</a> using either <a href="https://github.com/axios/axios" target="_blank">Axios</a> or <a href="https://www.apollographql.com/" target="_blank">Apollo</a> to get data from our <a href="https://www.w3.org/2001/sw/wiki/REST" target="_blank">REST</a> or <a href="https://graphql.org/" target="_blank">GraphQL</a> APIs.  Hosting it all on the <a href="https://cloud.google.com/products/" target="_blank">Google Cloud Platform</a>.</p>

					<p>Currently working as a Software Engineer at <a href="https://socialblade.com/info/team" target="_blank">Social Blade LLC</a>.</p>

				</div>
				<div class="right">
					<a v-for="social in socials" :href="social[1]" target="_blank" v-bind:key="social[2]+social[0]">
						<div :class="`button ${social[2]}`">
							<icon :icon="['fab', social[2]]"></icon>
							{{social[0]}}
							<span v-if="social[3]" v-text="social[3]"></span>
						</div>
					</a>
				</div>
			</div>
			<Footer></Footer>
		</div>
	</div>
</template>

<script>
export default {
	name: 'HomePage',
	computed: {
		twitch () { return this.$store.state.me },
		socials () {
			return [
				[ "Follow me on Twitch", "https://www.twitch.tv/modesttim", "twitch",
					this.twitch ? this.twitch.user.followers.totalCount.toLocaleString() : null ],
				[ "Follow on Twitter", "https://twitter.com/modesttim", "twitter" ],
				[ "Check out my GitHub", "https://github.com/TimothyCole", "github" ],
				[ "View my Instagram", "https://instagram.com/modesttim", "instagram" ],
				[ "Join us on Discord", "https://modest.land/discord", "discord" ],
			]
		}
	}
}
</script>

<style lang="scss" scoped>
	$white: #dfebf5;
	$whiteish: #aabccb;

	#HomePage {
		width: 100%;
		min-height: 100%;
		background-image: url('https://storage.googleapis.com/cdn.tcole.me/setup-compressed.jpg');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
		overflow: hidden;
	}

	.gradient {
		height: 100%;
		width: 100%;
		background: rgba(50,59,72, 0.9);
		background: linear-gradient(-55deg, rgba(36,39,48,0.9) 0%, rgba(50,59,72,0.9) 100%);
		display: flex;
		flex-direction: column;
		overflow: hidden auto;

		.billboard {
			display: flex;
			flex: 2 0px;
			align-items: center;

			@media only screen and (max-width: 845px), (max-height: 675px) {
				align-items: top;
				margin: 25px 0;


				& > div {
					flex: 1;
					height: 100%;
					width: 100%;
				}
			}

			.left {
				order: 1;
				z-index: 1;

				h1 {
					font-weight: 400;
					margin-bottom: 35px;
				}

				a {
					color: $white;
					text-decoration: none;
					font-style: italic;
					font-weight: 300;

					&[href="https://socialblade.com/info/team"] {
						font-weight: 500;
						font-style: normal;
						color: #b3382c;
					}
				}
			}

			.right {
				order: 2;
				padding-left: 100px;

				a {
					width: 275px;
					display: block;

					.button {
						width: 100%;
						display: inline-block;
						margin: 10px 0;
						border: 1px solid auto;
						padding: 13px 20px;
						border-radius: 4px;
						font-weight: 400;
						text-transform: uppercase;
						color: #ffffff;
						vertical-align: middle;
						background: rgba(0, 0, 0, 0.15);
						border: 1px solid rgba(0, 0, 0, 0.2);

						svg { padding-right: 9px; }

						span {
							float: right;
							background: rgba(255, 255, 255, 0.075);
							padding: 2px 5px;
							margin-left: 10px;
							border-radius: 3px;
							color: lighten($whiteish, 5%);
							font-size: 0.9em;
						}

						&:hover {
							cursor: pointer;
							border: none;
							padding: 14px 21px;

							&.twitch {
								background: rgb(108, 36, 167);
								background: linear-gradient(49deg, rgb(108, 36, 167) 0%, rgba(163,81,181,1) 100%);
							}
							&.twitter {
								background: rgb(81, 104, 181);
								background: linear-gradient(49deg, rgb(81, 104, 181) 0%, rgb(81, 141, 181) 100%);
							}
							&.github {
								background: rgb(50, 58, 83);
								background: linear-gradient(49deg, rgb(63, 73, 104) 0%, rgb(99, 111, 146) 100%);
							}
							&.instagram {
								background: rgb(181, 126, 81);
								background: linear-gradient(49deg, rgb(181, 126, 81) 0%, rgb(158, 81, 181) 100%);
							}
							&.discord {
								background: rgb(99, 81, 181);
								background: linear-gradient(49deg, rgb(99, 81, 181) 0%, rgb(92, 103, 197) 100%);
							}
						}
					}
				}
			}

			@media (max-width: 1445px) {
				.right {
					display: none;
				}
				.left {
					padding: 20px;
				}
			}
		}
	}
</style>
