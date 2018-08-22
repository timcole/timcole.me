import Vue from 'vue';
import VueRouter from 'vue-router';
import Vuex from 'vuex';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(Vuex);

import Header from './components/Header.vue';
import SubscribeModal from './components/SubscribeModal.vue';
import ToolTip from './components/ToolTip.vue';
import Footer from './components/Footer.vue';

Vue.component("Header", Header);
Vue.component("SubscribeModal", SubscribeModal);
Vue.component("ToolTip", ToolTip);
Vue.component("Footer", Footer);

const store = new Vuex.Store({
	state: {
		cdn: "https://cdn.tcole.me",
		me: null,
	},
	getters: {
		cdn: (state) => (file) => {
			return `${state.cdn}/${file}`
		}
	}
});

import HomePage from './pages/HomePage.vue';
import Videos from './pages/Videos.vue';
import Stream from './pages/Stream.vue';
import Screenshot from './pages/Screenshot.vue';
import NotFound from './pages/NotFound.vue';
const router = new VueRouter({
	routes: [
		{ name: "Home", path: '/', component: HomePage },
		{ name: "Videos", path: '/videos', component: Videos },
		{ name: "Stream", path: '/stream', component: Stream },
		{ name: "ModestStream", path: '/stream/:streamer', component: Stream },
		{ name: "Screenshot", path: '/ss/:screenshot', component: Screenshot },
		{ name: "NotFound", path: '*', component: NotFound }
	],
	mode: 'history'
})

import client from './graphql-client';
Vue.mixin({ data: client })

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(App)
});