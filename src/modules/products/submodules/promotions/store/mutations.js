import {
  CREATE_PROMOTION,
  UPSERT_PROMOTION,
  EDIT_PROMOTION,
  DELETE_PROMOTION,
  LIST_PROMOTIONS,
  BOOST_PROMOTION,
  CANCEL_BOOST_PROMOTION,
  SET_BOOST_LIST
} from './mutation-types';

export default {
  [CREATE_PROMOTION]: (state, { promotion }) => {
    state.promotions.push(promotion);
  },
  [UPSERT_PROMOTION]: (state, { promotion }) => {
    const index = state.promotions.findIndex(t => t.id === promotion.id);

    if (index >= 0) state.promotions.splice(index, 1, promotion);
    else state.promotions.push(promotion);
  },
  [EDIT_PROMOTION]: (state, { promotion }) => {
    const index = state.promotions.findIndex(t => t.id === promotion.id);
    state.promotions.splice(index, 1, promotion);
  },
  [BOOST_PROMOTION]: (state, { boost }) => {
    const index = state.promotions.findIndex(t => t.id === boost.promotionId);
    const oldPromotion = state.promotions[index];
    state.promotions.splice(index, 1, {
      ...oldPromotion,
      boost
    });
  },
  [CANCEL_BOOST_PROMOTION]: (state, { boost }) => {
    const index = state.promotions.findIndex(
      t => t.boost && t.boost.id === boost.id && t.id === boost.promotionId
    );
    
    if (+index >= 0) {
      const oldPromotion = state.promotions[index];
      state.promotions.splice(index, 1, {
        ...oldPromotion,
        boost: null
      });
    }
  },
  [DELETE_PROMOTION]: (state, { id }) => {
    const index = state.promotions.findIndex(t => t.id === id);
    state.promotions.splice(index, 1);
  },
  [LIST_PROMOTIONS]: (state, { promotions }) => {
    state.promotions = promotions;
  },
  [SET_BOOST_LIST]: (state, { boostList }) => {
    state.boostedPromotions = boostList;
  },
};
