import {
  ADD_ARRAY_ORDERS,
  EDIT_ORDER,
  LIST_ORDERS,
  SET_LOADING,
  PLAY_NOTIFICATION,
  STOP_NOTIFICATION,
  NEW_MESSAGE,
  LOAD_MESSAGES,
  SET_COMPANY,
  SET_MESSAGE_AS_SEEN
} from './mutation-types';

import AudioPath from './sound-notification-short.mp3';

import moment from 'moment';

function notify() {
  if (!('Notification' in window)) {
    alert('Este browser não suporta notificações de Desktop');
  }

  // Let's check whether notification permissions have already been granted
  else if (Notification.permission === 'granted') {
    // If it's okay let's create a notification
    var notificacao = new Notification('Chegou', {
      body: 'Chegou um novo pedido!',
      icon: '../../../assets/img/logo.png',
      vibrate: [200, 100, 200],
      requireInteraction: true
    });
  }

  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied') {
    Notification.requestPermission(function(permission) {
      // If the user accepts, let's create a notification
      if (permission === 'granted') {
        var notificacao = new Notification('Chegou', {
          body: 'Chegou um novo pedido!',
          icon: '../../../assets/img/logo.png',
          vibrate: [200, 100, 200],
          requireInteraction: true
        });
      }
    });
  }
}
export default {
  [EDIT_ORDER]: (state, { order }) => {
    const orders = state.orders.filter(t => t.id === order.id);
    if (orders.length) {
      const indice = state.orders.findIndex(t => t.id === order.id);
      state.orders.splice(indice, 1, Object.assign(orders[0], order));
    }
  },
  [LIST_ORDERS]: (state, { orders }) => {
    state.orders = orders;
  },
  [LOAD_MESSAGES]: (state, { messages }) => {
    state.ordersMessages = messages;
  },
  [PLAY_NOTIFICATION]: state => {
    const player = document.getElementById('player');
    player.play();
  },
  [STOP_NOTIFICATION]: state => {
    const player = document.getElementById('player');
    player.pause();
  },
  [ADD_ARRAY_ORDERS]: (state, { orders }) => {
    orders.forEach(order => {
      if (state.orders.filter(o => +o.id === +order.id).length == 0) {
        state.orders.push(order);
        // notify();
      }
    });
  },
  [NEW_MESSAGE]: (state, { message }) => {
    if (state.ordersMessages.filter(m => +m.id === +message.id).length == 0) {
      state.ordersMessages.push(message);
    }
  },
  [SET_MESSAGE_AS_SEEN]: (state, { orderId, isCompany }) => {
    state.ordersMessages = state.ordersMessages.map(m => {
      if (m.orderId != orderId) return m;
      if (isCompany && m.senderType == 0) return m;
      if (!isCompany && m.senderType == 1) return m;

      return {
        ...m,
        seenAt: moment().format('YYYY-MM-DD HH:mm:ss')
      };
    });
  },
  [SET_LOADING]: (state, { loading }) => {
    state.loading = loading;
  },
  [SET_COMPANY]: (state, { company }) => {
    state.company = company;
  }
};
