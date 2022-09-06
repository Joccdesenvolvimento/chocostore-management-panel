import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import themes from './themes';
import defaultIcons from './default-icons';
import { Ripple } from 'vuetify/lib/directives';

import './imports/fonts';
import './imports/styles';
import './imports/icons';

Vue.use(Vuetify, {
  directives: {
    Ripple
  }
});

export default new Vuetify({
  icons: {
    iconfont: 'mdi',
    values: defaultIcons
  },
  theme: {
    options: {
      customProperties: true
    },
    themes
  }
});
