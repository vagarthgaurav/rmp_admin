import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import axios from 'axios'

const base = axios.create({
  baseURL: 'http://api.formavisioplus.com/v1'
})

Vue.prototype.$http = base



Vue.config.productionTip = false

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
