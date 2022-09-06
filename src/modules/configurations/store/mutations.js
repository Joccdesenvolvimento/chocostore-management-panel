import {
  LIST_USERS,
  CREATE_USERS,
  DELETE_USER,
  EDIT_USER
} from './mutation-types';

export default {
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
  }
};
