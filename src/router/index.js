import Vue from 'vue';
import VueRouter from 'vue-router';

import authRoutes from '@/modules/auth/router/';
import productsRoutes from '@/modules/products/router/';
import ordersRoutes from '@/modules/orders/router/';
import configurationsRoutes from '@/modules/configurations/router/';
import financialRoutes from '@/modules/financial/router/';

import authMiddleware from '@/modules/auth/router/auth-middleware';

Vue.use(VueRouter);

const routes = [
    ...authRoutes,
    ...ordersRoutes,
    ...productsRoutes,
    ...configurationsRoutes,
    ...financialRoutes,
    {
        path: '/login',
        redirect: '/empresas',
    },
    {
        path: '/',
        redirect: '/login'
    }
];

const router = new VueRouter({
    routes,
    mode: 'history',
});

router.beforeEach(authMiddleware);

export default router;