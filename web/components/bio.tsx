import * as React from "react";

class Bio extends React.Component<any> {
	age (): number {
		var ageMs = Date.now() - new Date("03/10/1997").getTime();
		var ageDate = new Date(ageMs);
		return Math.abs(ageDate.getUTCFullYear() - 1970);
	}
	render () {
		return (
			<div className={this.props.className}>
				<h1>About me</h1>

				<p>My name is <b>Timothy Cole 🦄</b> or as my parents refer to me, tech support but you can call me <b>Tim</b>!</p>

				<p>I'm a <b>{this.age()} year old</b>, self-taught, software engineer currently living in <b>Los Angeles, CA</b>.</p>

				<p>When I was 10 years old I fell in love with computers.  I thought they were so neat that I wanted to become the CEO of Intel one day.  When I was 13 I realized how intriguing websites are so I started to tinker with inspect element.  It wasn't until then when I realized what I wanted to do with my life. A few months passed and I was still learning and investing my time away.</p>

				<p><em>EUREKA!</em> - Finally, by the age of 14, I created my very first website!  All front-end and far from perfect, but it was mine that's all that mattered.  As time passed, I completed many projects, gradually becoming more educated and working harder as ever.</p>

				<p>After hating school for my entire life, I decided to drop out of high school at age 17 to pursue my career as a programmer.</p>

				<p>I'm now fluent with many technologies.  Primarily I write server side code in <a href="https://golang.org/" target="_blank">Go</a>, while storing data in either <a href="https://cloud.google.com/spanner/" target="_blank">Spanner</a> or <a href="https://www.mongodb.com/" target="_blank">MongoDB</a> with <a href="https://redis.io/" target="_blank">Redis</a> as a cache.  Typically on the client side of things I use <a href="https://reactjs.org/" target="_blank">React</a> with the normal bells and whistles like <a href="https://redux.js.org/" target="_blank">Redux</a> and <a href="https://nextjs.org/" target="_blank">Next</a> using either <a href="https://www.npmjs.com/package/node-fetch" target="_blank">node-fetch</a> or <a href="https://www.apollographql.com/" target="_blank">Apollo</a> to get data from our <a href="https://www.w3.org/2001/sw/wiki/REST" target="_blank">REST</a> or <a href="https://graphql.org/" target="_blank">GraphQL</a> APIs.  Hosting it all on <a href="https://www.vultr.com/?ref=7804157-4F" target="_blank">Vultr</a> Cloud Servers.</p>

				<p>Current Software Engineer at <a href="https://socialblade.com/info/team" target="_blank">Social Blade LLC</a> and <a href="https://notify.me/" target="_blank">Notify Technology, Inc.</a></p>

				<p>Volunteer Community Admin with <a href="https://link.twitch.tv/devchat" target="_blank">TwitchDev <sup>Twitch Interactive, Inc.</sup></a>.</p>
			</div>
		)
	}
}

export default Bio;
