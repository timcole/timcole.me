<template>
	<div id="HomePage">
		<div class="gradient">
			<Header class="container"></Header>
			<div class="container billboard">
				<div class="left">
					<h1>About me</h1>

					<p>My name is <b>Timothy Cole</b> or as my parents refer to me, tech support but you can call me <b>Tim</b>!<br><br>
					I'm a <b>21 year old</b>, self-taught, full-stack web developer living on the coastal side of <b>North Carolina</b>.<br><br>
					When I was 10 years old I fell in love with computers. I thought they were so neat that I wanted to become the CEO of Intel one day! When I was 13 I realized how intriguing websites are so I started to tinker with inspect element. It wasn't until then when I realized what I wanted to do with my life. A few months passed and I was still learning and investing my time away.<br><br>
					<i>EUREKA!</i> - Finally, by the age of 14, I created my very first website! All front-end and far from perfect, but it was mine that's all that mattered. As time passed, I completed many projects, gradually becoming more educated and working harder as ever.<br><br>
					After hating school for my entire life, when I was 17 in freshmen year, I decided to drop out to pursue my career as a web developer.<br><br>
					Now I'm fluent in CSS, HTML, JS, Golang, NodeJS, and PHP with a touch of Python and Java (Android Development), currently working as QA and Development at <a href="https://socialblade.com/info/team" target="_blank">SocialBlade</a>.</p>

					<a href="https://www.twitch.tv/modesttim" target="_blank"><div class="twitch">Follow me on Twitch <span v-if="twitch" v-text="twitch.user.followers.totalCount.toLocaleString()"></span></div></a>
				</div>
				<div class="right">
					<img src="https://cdn.tcole.me/themodestland-dark.png" alt="">
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
		twitch () { return this.$store.state.me }
	}
}
</script>

<style lang="scss" scoped>
	$white: #dfebf5;
	$whiteish: #aabccb;

	#HomePage {
		width: 100%;
		min-height: 100%;
		background-image: url('https://cdn.tcole.me/setup.png');
		background-position: center;
		background-repeat: no-repeat;
		background-size: cover;
	}

	.gradient {
		height: 100%;
		width: 100%;
		background: rgba(50,59,72, 0.9);
		background: linear-gradient(-55deg, rgba(36,39,48,0.9) 0%, rgba(50,59,72,0.9) 100%);
		display: flex;
		flex-direction: column;
		overflow: hidden;

		.billboard {
			display: flex;
			flex: 2 0px;
			align-items: center;
			overflow: hidden auto;

			@media only screen and (max-width: 845px), (max-height: 675px) {
				align-items: top;
				margin: 25px 0;
			}

			.left {
				order: 1;
				z-index: 1;

				h1 {
					font-weight: 400;
					margin-bottom: 35px;
				}

				a[href="https://socialblade.com/info/team"] {
					color: rgba(48,139,205,1);
					text-decoration: none;
					font-weight: 500;
				}

				.twitch {
					display: inline-block;
					margin-top: 35px;
					border: 1px solid auto;
					padding: 13px 20px;
					border-radius: 4px;
					font-weight: 400;
					text-transform: uppercase;
					background: rgb(48,139,205);
					background: linear-gradient(49deg, rgba(48,139,205,1) 0%, rgba(163,81,181,1) 100%);
					color: #ffffff;
					vertical-align: middle;

					span {
						background: rgba(36,39,48,0.5);
						padding: 2px 5px;
						margin-left: 10px;
						border-radius: 3px;
						color: lighten($whiteish, 5%);
						font-size: 0.9em;
					}

					&:hover {
						cursor: pointer;
						transition: background 0.5s ease;
						background: linear-gradient(-49deg, rgba(163,81,181,1) 0%, rgba(48,139,205,1) 100%);
					}
				}
			}

			.right {
				order: 2;

				img {
					width: 500px;
					margin: 0 -50px;

					-webkit-touch-callout: none;
					-webkit-user-select: none;
					-moz-user-select: none;
					-ms-user-select: none;
					user-select: none;
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
