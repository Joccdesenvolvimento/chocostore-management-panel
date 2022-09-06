import differenceInDaysBetweenDates from './dates-difference-in-days';
import { currency } from '@/utils/helpers/currency';

const getBoostAmountSpent = boost => {
  const days = getBoostDurationDays(boost);

  return (days * 2);
};

const getBoostDurationDays = boost => {
  if (!boost.endsAt) return 0;

  const days = differenceInDaysBetweenDates(boost.endsAt, boost.createdAt);

  return days;
};

export const calculateAmountSpentBoostedPromotions = boostList => {
 
  if(!Array.isArray(boostList)) return 0;

  let amount = 0;

  for (const boost of boostList) {
    amount += getBoostAmountSpent(boost);
  }

  return amount;
};

export const getAmountSpentBoostedPromotionsCurrency = boostList => {
  return currency(calculateAmountSpentBoostedPromotions(boostList));
};
