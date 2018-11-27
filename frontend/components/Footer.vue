<template>
	<p>Copyright &copy; {{ start }}-{{ end }} - Timothy Cole - All Rights Reserved. &mdash; <a href="https://github.com/TimothyCole/timcole.me" target="_blank">{{ odds ? "Fork" : "Star" }} on Github</a> - Commit <span v-text="version"></span></p>
</template>

<script>
export default {
	name: "Footer",
	data () {
		return {
			start: "1997",
			odds: Math.random() < 0.5,
			end: (new Date()).getFullYear(),
			version: window.Version.substring(0, 7)
		}
	}
}
</script>

<style lang="scss" scoped>
	p {
		color: #aabccb;
		font-size: 0.8em;
		display: inline-block;
		width: 100%;
		text-align: center;

		a {
			text-decoration: none;
			color: inherit;
		}
	}
</style>
