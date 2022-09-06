import userService from "../services/users-service"

import * as types from './mutation-types';

export default {
  getUsers: async ({ commit }) => {
    const response = await userService.getAll()
    commit(types.LIST_USERS, { users: response.data });
  },
  createUser: async ({ commit }, { user }) => {
    const response = await userService.create(user)
    commit(types.CREATE_USERS, { user: response.data });
  },
  deleteUser: async ({ commit }, { user }) => {
    const response = await userService.delete(user)
    commit(types.DELETE_USER, { id: user.id } );
  },
  editUser: async ({ commit }, { user, editPassword }) => {
    user.editPassword = editPassword
    const response = await userService.edit(user)
    commit(types.EDIT_USER, {user: response.data} );
  },
};
