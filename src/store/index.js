import Vue from 'vue';
import Vuex from 'vuex';
import VueCookies from 'vue-cookies';
import axios from 'axios';

Vue.use(Vuex);
Vue.use(VueCookies);

let root = 'https://api.formavisioplus.com/v1';

export default new Vuex.Store({
	state: {
		token: VueCookies.get('admin_token') || ''
	},
	mutations: {
		saveUser: (state, { user }) => {
			localStorage.setItem('admin_user_data', JSON.stringify(user));
		},
		signout: () => {
			VueCookies.remove('admin_token');
			localStorage.removeItem('admin_user_data');
		}
	},
	getters: {
		isLoggedIn: (state) => !!state.token,
		getUser: () => {
			return JSON.parse(localStorage.getItem('admin_user_data'));
		},
	},
	actions: {
		
	},
	modules: {}
});
