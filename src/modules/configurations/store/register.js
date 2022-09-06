import usersModule from './index';

const MODULE_NAME = 'users';

export default rootStore => {
  if (!(MODULE_NAME in rootStore._modules.root._children)) {
    rootStore.registerModule(MODULE_NAME, usersModule);
  }
};
