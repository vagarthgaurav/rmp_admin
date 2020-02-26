import Vue from 'vue';
import Vuetify from 'vuetify/lib';

import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

export default new Vuetify({
	icons: {
		iconfont: 'mdi' // 'mdi' || 'mdiSvg' || 'md' || 'fa' || 'fa4'
	},
	theme: {
		themes: {
			light: {
				primary: '#0B2027',
				secondary: '#70A9A1',
				button: '#40798C',
				event: '#820263',
				eventHover: '#FF5376',
			}
		}
	}
});
