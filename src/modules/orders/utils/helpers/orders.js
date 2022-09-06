import { STATUS_NAME, PAYMENT_METHODS } from './../enums';
import { mapAddress } from '@/utils/helpers/address';
import { currency } from '@/utils/helpers/currency';
import { maskBr } from 'js-brasil';

import moment from 'moment';

const mapOrder = order => {
  return {
    ...order,
    client: order.user.name,
    contact: maskBr.telefone(order.user.phone),
    amount: currency(order.amount),
    paymentMethodDescription: PAYMENT_METHODS[(+order.paymentMethod)-1],
    address: mapAddress(order),
    status: STATUS_NAME[order.statusId]
  };
};

const mapOrders = orders => {
  return orders.map(order => mapOrder(order));
};

const isScheduledOrderAvailableToPrepare = (order, deliveryTime) => {
  return moment().isSameOrAfter(moment(order.scheduleDate).subtract(deliveryTime, 'minutes'));
}

export {
  mapOrders,
  mapOrder,
  isScheduledOrderAvailableToPrepare
};
