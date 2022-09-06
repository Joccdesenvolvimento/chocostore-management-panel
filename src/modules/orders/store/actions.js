import OrdersService from './../services/orders-service';

import * as types from './mutation-types';

export default {
  editOrder: async ({ commit }, { order }) => {
    try {
      const response = await OrdersService.edit(order);
      commit(types.EDIT_ORDER, { order: response.data });
    } catch (err) {
      alert(err);
    }
  },
  getOrder: async ({ commit }, id) => {
    try {
      const response = await OrdersService.get(id);
      commit(types.LOAD_ORDER, { order: response.data });
    } catch (erro) {
      alert(erro);
      // commit(types.SETAR_ERRO, { erro });
    }
  },
  getOrders: async ({ commit }) => {
    try {
      const response = await OrdersService.getAll();

      commit(types.LIST_ORDERS, { orders: response.data });
      commit(types.SET_LOADING, { loading: false });
    } catch (erro) {
      // alert(erro);
      // commit(types.SETAR_ERRO, { erro });
    }
  },
  getOrdersMessages: async ({ commit }) => {
    try {
      const response = await OrdersService.getMessages();

      commit(types.LOAD_MESSAGES, { messages: response.data });
    } catch (erro) {
      //alert(erro);
      // commit(types.SETAR_ERRO, { erro });
    }
  },
  getLatestOrders: async ({ commit }, { lastId }) => {
    return new Promise((resolve, reject) => {
      OrdersService.getLatest(lastId)
        .then(response => {
          let arr = [];

          if (!Array.isArray(response.data)) {
            arr.push(response.data);
          } else {
            arr = response.data;
          }
          if (arr.length > 0) {
            commit(types.ADD_ARRAY_ORDERS, { orders: arr });
          }
          resolve(arr);
        })
        .catch(reject);
    });
  },

  sendMessage({ commit }, { socket, message }) {
    socket.emit('SEND_MESSAGE', message);
    commit(types.NEW_MESSAGE, { message });
  },
  setMessageAsSeen: ({ commit }, { orderId }) => {
    commit(types.SET_MESSAGE_AS_SEEN, { orderId, isCompany: true });
  },
  playNotification({ commit }) {
    commit(types.PLAY_NOTIFICATION);
  },
  setCompany({ commit }, { company }) {
    commit(types.SET_COMPANY, { company });
  },
  stopNotification({ commit }) {
    commit(types.STOP_NOTIFICATION);
  }
};
