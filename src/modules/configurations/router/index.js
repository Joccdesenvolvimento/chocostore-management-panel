const Container = () => import('./../views/Container');
const ConfigurationsPage = () => import('./../views/ConfigurationsPage');

import userTypeMiddleware from '@/modules/auth/router/user-type-middleware';

export default [
  {
    path: '/configuracoes',
    component: Container,
    meta: { requiresAuth: true },
    beforeEnter: userTypeMiddleware,
    children: [
      {
        path: '',
        name: 'configurations',
        component: ConfigurationsPage
      }
    ]
  }
];
