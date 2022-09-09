import actions from './actions';
import getters from './getters';
import mutations from './mutations';

const state = {
  users: [],
  customers: []
};

export default {
  namespaced: true,
  state,
  getters,
  mutations,
  actions
};
