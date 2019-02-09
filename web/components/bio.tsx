import * as React from "react";

class Bio extends React.Component<any> {
	render () {
		return (
			<div className={this.props.className}>
				<h1>About me</h1>

				<p>My name is <b>Timothy Cole</b> or as my parents refer to me, tech support but you can call me <b>Tim</b>!</p>

				<p>I'm a <b>21 year old</b>, self-taught, software engineer living on the coastal side of <b>North Carolina</b>.</p>

				<p>When I was 10 years old I fell in love with computers.  I thought they were so neat that I wanted to become the CEO of Intel one day.  When I was 13 I realized how intriguing websites are so I started to tinker with inspect element.  It wasn't until then when I realized what I wanted to do with my life. A few months passed and I was still learning and investing my time away.</p>

				<p><em>EUREKA!</em> - Finally, by the age of 14, I created my very first website!  All front-end and far from perfect, but it was mine that's all that mattered.  As time passed, I completed many projects, gradually becoming more educated and working harder as ever.</p>

				<p>After hating school for my entire life, I decided to drop out of high school at age 17 to pursue my career as a programmer.</p>

				<p>I'm now fluent with many technologies.  Primarily I write server side code in <a href="https://golang.org/" target="_blank">Go</a>, while storing data in either <a href="https://cloud.google.com/spanner/" target="_blank">Spanner</a> or <a href="https://cloud.google.com/datastore/" target="_blank">Datastore</a> with <a href="https://redis.io/" target="_blank">Redis</a> as a cache.  Typically on the client side of things I use <a href="https://vuejs.org/" target="_blank">Vue.js</a> with the normal bells and whistles like <a href="https://vuex.vuejs.org/" target="_blank">Vuex</a> and <a href="https://router.vuejs.org/" target="_blank">Vue Router</a> using either <a href="https://github.com/axios/axios" target="_blank">Axios</a> or <a href="https://www.apollographql.com/" target="_blank">Apollo</a> to get data from our <a href="https://www.w3.org/2001/sw/wiki/REST" target="_blank">REST</a> or <a href="https://graphql.org/" target="_blank">GraphQL</a> APIs.  Hosting it all on the <a href="https://cloud.google.com/products/" target="_blank">Google Cloud Platform</a>.</p>

				<p>Currently working as a Software Engineer at <a href="https://socialblade.com/info/team" target="_blank">Social Blade LLC</a>.</p>
			</div>
		)
	}
}

export default Bio;