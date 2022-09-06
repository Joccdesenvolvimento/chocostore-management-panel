const Container = () => import('./../views/Container');
const FinancialPage = () => import('./../views/FinancialPage');

import userTypeMiddleware from '@/modules/auth/router/user-type-middleware';

export default [
  {
    path: '/financeiro',
    component: Container,
    meta: { requiresAuth: true },
    beforeEnter: userTypeMiddleware,
    children: [
      {
        path: '',
        name: 'financial',
        component: FinancialPage
      }
    ]
  }
];
