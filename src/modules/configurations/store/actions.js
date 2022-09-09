import userService from "../services/users-service"

import * as types from './mutation-types';

export default {
  //Users
  getUsers: async ({ commit }) => {
    const response = await userService.getAll()
    commit(types.LIST_USERS, { users: response.data });
  },
  createUser: async ({ commit }, { user }) => {
    const response = await userService.create(user)
    commit(types.CREATE_USERS, { user: response.data });
  },
  deleteUser: async ({ commit }, { user }) => {
    await userService.delete(user)
    commit(types.DELETE_USER, { id: user.id } );
  },
  editUser: async ({ commit }, { user, editPassword }) => {
    user.editPassword = editPassword
    const response = await userService.edit(user)
    commit(types.EDIT_USER, {user: response.data} );
  },
  //Customers
  getCustomers: async ({ commit }) => {
    const response = await userService.getAllCustomers()
    commit(types.LIST_CUSTOMERS, { customers: response.data });
  },
  createCustomer: async ({ commit }, { customer }) => {
    const response = await userService.createCustomer(customer)
    commit(types.CREATE_CUSTOMERS, { customer: response.data });
  },
  deleteCustomer: async ({ commit }, { customer }) => {
    await userService.deleteCustomer(customer)
    commit(types.DELETE_CUSTOMER, { id: customer.id } );
  },
  editCustomer: async ({ commit }, { customer, editPassword }) => {
    customer.editPassword = editPassword
    const response = await userService.editCustomer(customer)
    commit(types.EDIT_CUSTOMER, {customer: response.data} );
  },
};
