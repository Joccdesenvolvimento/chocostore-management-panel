const Container = () => import('../views/Container');

const OrderPageList = () => import('../views/OrderPageList');

// import userTypeMiddleware from '@/modules/auth/router/user-type-middleware';

export default [
  {
    path: '/pedidos',
    component: Container,
    meta: { requiresAuth: true },
    children: [
      {
        path: '',
        name: 'order-list',
        component: OrderPageList
      }
    ]
  }
];
