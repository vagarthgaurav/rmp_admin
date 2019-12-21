import Vue from 'vue';
import Vuex from 'vuex';
import VueCookies from 'vue-cookies';
import axios from 'axios';

Vue.use(Vuex);
Vue.use(VueCookies);

let root = 'http://api.formavisioplus.com/v1';

export default new Vuex.Store({
	state: {
		token: VueCookies.get('user_token') || ''
	},
	mutations: {
		saveUser: (state, { user }) => {
			localStorage.setItem('user_data', JSON.stringify(user));
		}
	},
	getters: {
		isLoggedIn: (state) => !!state.token,
		getUser: () => {
			return JSON.parse(localStorage.getItem('user_data'));
		},
		getLocations: () => {
			return JSON.parse(localStorage.getItem('locations'));
		},
		getRegions: () => {
			return JSON.parse(localStorage.getItem('regions'));
		}
	},
	actions: {
		saveLocations: (context, id) => {
			let token = VueCookies.get('user_token');
			axios
				.get(root + '/training-center/' + id + '/location/findAll', {
					headers: { Authorization: 'Bearer ' + token }
				})
				.then((res) => {
					console.log(res);
					localStorage.setItem('locations', JSON.stringify(res.data));
				})
				.catch((e) => {
					console.log(e.response);
				});
		},
		saveRegions: () => {
			axios
				.get(root + '/public/region/findAll')
				.then((res) => {
					localStorage.setItem('regions', JSON.stringify(res.data));
				})
				.catch((e) => {
					console.log(e);
				});
		}
	},
	modules: {}
});
