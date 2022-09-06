import { mapOrders, mapOrder, isScheduledOrderAvailableToPrepare } from './../utils/helpers/orders';

/* eslint eqeqeq: "off" */

import moment from 'moment';

export default {
  orders: state => mapOrders(state.orders),
  getOrder: state => id => mapOrder(state.orders.find(order => order.id == id)),
  inProgress: state =>
    mapOrders(
      state.orders.filter(order => {
        const { statusId, deliveryMethod } = order;
        if (window.localStorage.getItem('user-type') == 'clerk') {
          return (
            (statusId === 1 ||
              statusId === 2 ||
              statusId == 3 ||
              statusId == 6) &&
            (!order.scheduleDate || isScheduledOrderAvailableToPrepare(order, state.company.deliveryTime)) && deliveryMethod == 2
          );
        } else {
          return (
            (statusId === 1 ||
              statusId === 2 ||
              statusId == 3 ||
              statusId == 6) &&
            (!order.scheduleDate || isScheduledOrderAvailableToPrepare(order, state.company.deliveryTime)))
        }
      })
    ),
  scheduled: state =>
    mapOrders(
      state.orders.filter(order => {
        if (window.localStorage.getItem('user-type') == 'clerk') {
          return (
            order.scheduleDate &&
            !isScheduledOrderAvailableToPrepare(order, state.company.deliveryTime)
            && (order.statusId == 1 || order.statusId == 2) && order.deliveryMethod == 2
          );
        } else {
          return (
            order.scheduleDate &&
            !isScheduledOrderAvailableToPrepare(order, state.company.deliveryTime)
            && (order.statusId == 1 || order.statusId == 2)
          );
        }
      }).sort((a, b) => {
        if (moment(a.scheduleDate).isSameOrBefore(b.scheduleDate)) return -1;
        else return 1;
      })
    ),
  registered: state =>
    mapOrders(
      state.orders.filter(({ statusId, deliveryMethod }) => {
        if (window.localStorage.getItem('user-type') == 'clerk') {
          return statusId === 1 && deliveryMethod == 2;
        } else {
          return statusId === 1;
        }
      })
    ),
  finished: state =>
    mapOrders(
      state.orders.filter(({ statusId, deliveryMethod }) => {
        if (window.localStorage.getItem('user-type') === 'clerk') {
          return (statusId === 4 || statusId === 5) && deliveryMethod == 2;
        } else {
          return statusId === 4 || statusId === 5;
        }
      })
    )
};
