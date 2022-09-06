import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

import * as types from '../modules/orders/store/mutation-types';

export default new Vuex.Store({
  actions: {
    [`SOCKET_RECEIVE_MESSAGE`]: ({ commit }, data) => {
      commit(`orders/${types.NEW_MESSAGE}`, { message: data }, { root: true });
    },
    [`SOCKET_ORDER_UPDATE`]: ({ commit }, data) => {
      commit(`orders/${types.EDIT_ORDER}`, { order: data }, { root: true });
    },
    [`SOCKET_NEW_ORDER`]: ({ commit }, data) => {
      Vue.prototype.$socket.emit('ENTER_ON_ORDER_CHAT', data.id);
      commit(
        `orders/${types.ADD_ARRAY_ORDERS}`,
        { orders: [data] },
        { root: true }
      );
    },
    [`SOCKET_MESSAGE_SEEN`]: ({ commit }, { orderId, isCompany = false }) => {
      commit(
        `orders/${types.SET_MESSAGE_AS_SEEN}`,
        { orderId: orderId, isCompany },
        { root: true }
      );
    }
  }
});
