import './utils/global-components';

import Vue from 'vue';
import App from './App.vue';
import router from './router';
import store from '@/store/index';
import vuetify from '@/plugins/vuetify';
import '@/plugins/print';
import '@/plugins/external-components';

import VueSocketio from 'vue-socket.io';
import io from 'socket.io-client';

import baseUrlApiApp from './utils/base-url-apiapp';

const baseUrlWithNamespaced = `${baseUrlApiApp}/socket`;

Vue.use(
  new VueSocketio({
    debug: true,
    connection: io(baseUrlWithNamespaced, {
      path: '',
      transport: ['websocket'],
      query: {
        token: `Bearer ${window.localStorage.getItem('auth-token')}`
      }
    }),
    vuex: {
      store,
      options: {
        useConnectionNamespace: true
      },
      actionPrefix: 'SOCKET_'
    }
  })
);
Vue.directive('click-outside-custom', {
  bind: function (el, binding, vnode) {
    el.clickOutsideEvent = function (event) {
      // here I check that click was outside the el and his children
      if (!(el == event.target || el.contains(event.target))) {
        // and if it did, call method provided in attribute value
        if (vnode.context[binding.expression])
          vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener('click', el.clickOutsideEvent);
  },
  unbind: function (el) {
    document.body.removeEventListener('click', el.clickOutsideEvent);
  }
});

import VueMask from 'v-mask';
Vue.use(VueMask);

import VueTheMask from 'vue-the-mask';
Vue.use(VueTheMask);

Vue.config.productionTip = false;
const globalMixin = {
  // data() {
  //   return {
  //     user: {},
  //   }
  // },
  methods: {
    // setUser(user) {
    //   if(user.id){
    //     this.user = user
    //   }
    // },
    checkPermissions(allowedTypes, loggedType = window.localStorage.getItem('user-type')){
      // console.log(loggedType)
      let isAllowed = false
      allowedTypes.map((type) => {
        if (type === loggedType){
            isAllowed = true
        }
    })
      return isAllowed
    }
  }
}
Vue.mixin(globalMixin);
const appInstance = new Vue({
  // components: { VueCsvImport  },
  store,
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app');

store.$vueInstance = appInstance;
