import {
  LIST_USERS,
  CREATE_USERS,
  DELETE_USER,
  EDIT_USER,
  LIST_CUSTOMERS,
  CREATE_CUSTOMERS,
  DELETE_CUSTOMER,
  EDIT_CUSTOMER
} from './mutation-types';

export default {
  //User
  [LIST_USERS]: (state, { users }) => {
    state.users = users;
  },
  [CREATE_USERS]: (state, { user }) => {
    state.users.push(user);
  },
  [DELETE_USER]: (state, { id }) => {
    const index = state.users.findIndex(u => u.id === id);
    if (index > 0) {
      state.users.splice(index, 1);
    }
  },
  [EDIT_USER]: (state, { user }) => {
    const index = state.users.findIndex(u => u.id === user.id);
    if (index > 0) {
      state.users.splice(index, 1, user);
    }
  },
  //Customer
  [LIST_CUSTOMERS]: (state, { customers }) => {
    state.customers = customers;
  },
  [CREATE_CUSTOMERS]: (state, { customer }) => {
    state.customers.push(customer);
  },
  [DELETE_CUSTOMER]: (state, { id }) => {
    const index = state.customers.findIndex(u => u.id === id);
    if (index > 0) {
      state.customers.splice(index, 1);
    }
  },
  [EDIT_CUSTOMER]: (state, { customer }) => {
    const index = state.customers.findIndex(u => u.id === customer.id);
    if (index > 0) {
      state.customers.splice(index, 1, customer);
    }
  }
};
