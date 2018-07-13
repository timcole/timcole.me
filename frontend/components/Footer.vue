<template>
	<p>Copyright &copy; {{ start }}-{{ end }} - Timothy Cole - All Rights Reserved.</p>
</template>

<script>
export default {
	name: "Footer",
	data () {
		return {
			start: "1997",
			end: (new Date()).getFullYear()
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
	}
</style>
