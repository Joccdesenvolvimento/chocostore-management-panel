import actions from './actions';
import getters from './getters';
import mutations from './mutations';

import AudioPath from './sound-notification-short.mp3';

const audioNotification = new Audio(AudioPath);

audioNotification.loop = true;
audioNotification.muted = true;

const state = {
  erro: undefined,
  notificationSound: audioNotification,
  ordersMessages: [],
  orders: [],
  company: {},
  loading: true
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
