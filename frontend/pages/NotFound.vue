<template>
	<div id="NotFound">
		<div class="header"><Header class="container"></Header></div>
		<div class="container error">
			<h1>404</h1>
			<h2>Not Found</h2>
		</div>
		<Footer></Footer>
	</div>
</template>

<script>
export default {
	name: "NotFound"
}
</script>

<style lang="scss" scoped>
	#NotFound {
		background: #2b2e39;
		display: flex !important;

		.header {
			background: rgba(#242730, 0.8);
		}

		.error {
			text-align: center;
			padding: 40px;
			flex: 2 0;

			h1 {
				font-size: 15em;
				margin: -25px 0;
				padding: 0;
			}

			h2 {
				font-size: 3em;
				margin: 0;
				padding: 0;
			}
		}
	}
</style>

