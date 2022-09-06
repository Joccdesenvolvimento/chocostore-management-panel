import {
  mapPromotions,
  getActivePromotions,
  getInactivePromotions,
} from '../utils/mappers/promotions';

import { getAmountSpentBoostedPromotionsCurrency } from '../utils/helpers/boost-amount';

export default {
  promotions: state => mapPromotions(state.promotions),
  activePromotions: state => getActivePromotions(state.promotions),
  inactivePromotions: state => getInactivePromotions(state.promotions),
  amountSpentBoostedPromotions: state =>
    getAmountSpentBoostedPromotionsCurrency(state.boostedPromotions)
};
