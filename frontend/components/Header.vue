<template>
	<div id="Header">
		<div class="left">
			<router-link to="/" tag="img" src="https://cdn.tcole.me/logo.png" alt="Timothy Cole Logo"></router-link>
			<router-link to="/" tag="h4" >Timothy Cole</router-link>
		</div>
		<div class="right">
			<ul>
				<li v-for="link in menu" v-bind:key="link.name"><router-link :to="link.to">{{ link.name }}</router-link></li>
				<li><a href="https://subs.modest.land/" target="_blank">Sub Perks</a></li>
			</ul>
			<div class="subscribe" id="show-modal" @click="showSubscribe = true">Subscribe</div>
			<SubscribeModal v-if="showSubscribe" @close="showSubscribe = false"></SubscribeModal>
		</div>
	</div>
</template>

<script>
export default {
	name: 'Header',
	data () {
		return {
			showSubscribe: (window.location.hash.indexOf("subscribe") != -1 ? true : false),
			menu: [
				{ to: "/", name: "Home" },
				{ to: "/videos", name: "VODs" },
			]
		}
	}
}
</script>

<style lang="scss" scoped>
	$white: #dfebf5;
	$whiteish: #aabccb;

	#Header {
		width: 100%;
		padding: 15px 0;
		display: flex;

		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;

		* { vertical-align: middle; }
	}

	.left {
		order: 1;
		margin-left: 15px;
		flex: 2 0px;

		h4 {
			margin: 0;
			display: inline;
			font-size: 1.65em;
			font-weight: 100;
			text-transform: uppercase;
			padding-left: 10px;

			@media (max-width: 775px) {
				& { display: none; }
			}
		}
	}

	.right {
		order: 2;
		color: $whiteish;
		font-weight: 300;
		margin-right: 15px;

		ul {
			list-style: none;
			display: inline-block;
			margin: 0;

			li {
				display: inline-block;
				margin-left: 40px;
				&:nth-child(1) { margin-left: 0; }

				a {
					color: $whiteish;
					text-decoration: none;
					font-weight: 300;
					padding: 0 .25px;
					line-height: 40px;

					&.router-link-exact-active, &:hover {
						color: $white;
						font-weight: 400;
						padding: 0px;
					}
				}
			}
		}

		.subscribe {
			display: inline-block;
			margin-left: 35px;
			border: 1px solid $whiteish;
			padding: 10px 20px;
			border-radius: 7px;

			&:hover {
				cursor: pointer;
				border-color: transparent;
				transition: background 0.5s ease;
				background: rgb(48,139,205);
				background: linear-gradient(133deg, rgba(48,139,205,1) 0%, rgba(81,181,156,1) 100%); 
				color: $white;
			}
		}
	}
</style>
