import Vue from 'vue';
import App from './App.vue';
import './registerServiceWorker';
import router from './router';
import store from './store';
import vuetify from './plugins/vuetify';
import axios from 'axios';
import VueCookies from 'vue-cookies';
import VueI18n from 'vue-i18n';

Vue.use(VueI18n);

Vue.use(VueCookies);

const ax = axios.create({
	baseURL: 'https://api.formavisioplus.com/v1'
});

Vue.prototype.$http = ax;

const messages = {
	en: {
		message: {
			hello: 'hello world'
		}
	},
	fr: {
		message: {
			hello: 'Bonjour le monde'
		}
	}
};

// Create VueI18n instance with options
const i18n = new VueI18n({
	locale: 'fr', // set locale
	messages // set locale messages
});

Vue.config.productionTip = false;

new Vue({
	router,
	store,
	vuetify,
	i18n,
	render: (h) => h(App)
}).$mount('#app');
