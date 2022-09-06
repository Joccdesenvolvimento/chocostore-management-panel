import actions from './actions';
import getters from './getters';
import mutations from './mutations';

import promotionsActions from '../submodules/promotions/store/actions';
import promotionsGetters from '../submodules/promotions/store/getters';
import promotionsMutations from '../submodules/promotions/store/mutations';

const state = {
  erro: undefined,
  products: [],
  categories: [],
  variations: [],
  promotions: [],
  banners: [],
  highlights:[],
  amountSpentBoost: 0,
  boostedPromotions: [],
  loading: true
};

export default {
  namespaced: true,
  state,
  getters: {
    ...getters,
    ...promotionsGetters
  },
  mutations: {
    ...mutations,
    ...promotionsMutations
  },
  actions: {
    ...actions,
    ...promotionsActions
  }
};
