import Vue from 'vue';
import Vuex from 'vuex';
import VueCookies from 'vue-cookies';
import axios from 'axios';

Vue.use(Vuex);
Vue.use(VueCookies);

let root = 'https://api.formavisioplus.com/v1';

export default new Vuex.Store({
	state: {
		token: VueCookies.get('training_center_token') || ''
	},
	mutations: {
		saveUser: (state, { user }) => {
			localStorage.setItem('training_center_user_data', JSON.stringify(user));
		},
		signout: () => {
			VueCookies.remove('training_center_token');
			localStorage.removeItem('training_center_user_data');
		}
	},
	getters: {
		isLoggedIn: (state) => !!state.token,
		getUser: () => {
			return JSON.parse(localStorage.getItem('training_center_user_data'));
		},
	},
	actions: {
		
	},
	modules: {}
});
