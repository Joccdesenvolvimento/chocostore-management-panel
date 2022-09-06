import PromotionsService from '../services/promotions-service';
import * as types from './mutation-types';

export default {
  createPromotion: ({ commit }, { promotion }) => {
    return new Promise((resolve, reject) => {
      PromotionsService.create(promotion)
        .then(response => {
          commit(types.CREATE_PROMOTION, { promotion: response.data });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  boostPromotion: ({ commit }, { boost }) => {
    return new Promise((resolve, reject) => {
      PromotionsService.boostPromotion(boost)
        .then(response => {
          commit(types.BOOST_PROMOTION, { boost: response.data });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  cancelBoostPromotion: ({ commit }, { boost }) => {
    return new Promise((resolve, reject) => {
      PromotionsService.cancelBoostPromotion(boost)
        .then(response => {
          commit(types.CANCEL_BOOST_PROMOTION, { boost });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  editPromotion: ({ commit }, { promotion }) => {
    return new Promise((resolve, reject) => {
      PromotionsService.edit(promotion)
        .then(response => {
          commit(types.EDIT_PROMOTION, { promotion: response.data });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  deletePromotion: async ({ commit }, { id }) => {
    return new Promise((resolve, reject) => {
      PromotionsService.delete(id)
        .then(response => {
          commit(types.DELETE_PROMOTION, { id });
          resolve(response);
        })
        .catch(error => reject(error));
    });
  },
  getPromotions: async ({ commit }) => {
    try {
      const { data: promotions } = await PromotionsService.getAll();
      commit(types.LIST_PROMOTIONS, { promotions });
    } catch (error) {}
  },
  findBoostHistoric: async ({ commit }) => {
    try {
      const response = await PromotionsService.getBoostHistoric();

      commit(types.SET_BOOST_LIST, { boostList: response.data });
    } catch (err) {
      console.log(err);
    }
  }
};
