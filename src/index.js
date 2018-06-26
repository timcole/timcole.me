import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import App from './App.vue';

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(VueRouter);

import 'vue-awesome/icons';

import Header from './components/Header.vue';
import SubscribeModal from './components/SubscribeModal.vue';
import TheModestLand from './components/TheModestLand.vue';
import ToolTip from './components/ToolTip.vue';
import Footer from './components/Footer.vue';

Vue.component("Header", Header);
Vue.component("SubscribeModal", SubscribeModal);
Vue.component("TheModestLand", TheModestLand);
Vue.component("ToolTip", ToolTip);
Vue.component("Footer", Footer);

const store = new Vuex.Store({
	state: {
		_CLIENT_ID: "xbxtltofdtemb8hkchrsc1ijukifp0",
		gqlCache: []
	},
	mutations: {
		async gql(state, { key, query }) {
			if (!key) throw new Error("Missing GQL Cache Key");
			var body = JSON.stringify(query);

			var data = await fetch(`https://gql.twitch.tv/gql`, {
				method: "POST",
				headers: {
					"Client-ID": state._CLIENT_ID
				},
				body
			}).then(resp => resp.json());

			var update = state.gqlCache.findIndex(e => {
				return e.key === key;
			});
			var index = (update != -1 ? update : state.gqlCache.length);

			Vue.set(state.gqlCache, index, { key, query, data: data.data })
		}
	},
	getters: {
		getCache: (state) => (key) => {
			return state.gqlCache.find(e => {
				return e.key === key;
			});
		}
	}
});

import HomePage from './pages/HomePage.vue';
import Videos from './pages/Videos.vue';
import Stream from './pages/Stream.vue';
const router = new VueRouter({
	routes: [
		{ name: "Home", path: '/', component: HomePage },
		{ name: "Videos", path: '/videos', component: Videos },
		{ name: "Stream", path: '/stream', component: Stream },
		{ name: "ModestStream", path: '/stream/:streamer', component: Stream }
	],
	mode: 'history'
})

new Vue({
	el: '#app',
	store,
	router,
	render: h => h(App)
});