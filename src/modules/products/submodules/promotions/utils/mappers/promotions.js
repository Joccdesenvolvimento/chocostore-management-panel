import { currency } from '@/utils/helpers/currency';

import differenceInDaysBetweenDates from '../helpers/dates-difference-in-days';

import moment from 'moment';
moment.locale('pt-br');

export const mapPromotions = promotions =>
  promotions.map(promotion => mapPromotion(promotion));

export const mapPromotion = promotion => {
  const duration = promotion.endsAt
    ? differenceInDaysBetweenDates(promotion.endsAt, promotion.createdAt)
    : null;

  return {
    ...promotion,
    isBoostEnd: moment().isAfter(moment(promotion.boostEndsAt).add(1, 'days')),
    duration
  };
};

export const getActivePromotions = promotions => {
  
  const activePromotions = promotions.filter(promotion => {
    if (!promotion.endsAt) return true;

    const isActive = moment().isSameOrBefore(
      moment(moment(promotion.endsAt).format('YYYY-MM-DD'))
    );

    return isActive;
  });

  return mapPromotions(activePromotions);
};

export const getInactivePromotions = promotions => {
  const expiredPromotions = promotions.filter(promotion => {
    if (!promotion.endsAt) return false;
    const isExpired = moment().isAfter(
      moment(moment(promotion.endsAt).format('YYYY-MM-DD'))
    );

    return isExpired;
  });

  return mapPromotions(expiredPromotions);
};
