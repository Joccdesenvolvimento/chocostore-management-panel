
const Container = () => import('./../views/Container');

// const ProductPageDetails = () => import('./../views/ProductPageDetails');
const ProductPageList = () => import('./../views/ProductPageList');
// const ProductFormTaxDataEdit = () => import('./../forms/ProductFormTaxDataEdit');

// const userTypeMiddleware = () => import('@/modules/auth/router/user-type-middleware');
import userTypeMiddleware from '@/modules/auth/router/user-type-middleware';

export default [
  {
    path: '/produtos',
    component: Container,
    meta: { requiresAuth: true },
    beforeEnter: userTypeMiddleware,
    // beforeEnter: (to, from, next) => {
    //   const userType = window.localStorage.getItem('user-type');

    //   const ordersRoute = {
    //       path: '/pedidos',
    //       query: { redirect: to.fullPath },
    //   };

    //   if (userType !== 'clerk') {
    //       console.log("a")
    //       return next();
    //   }else{
    //       return next(ordersRoute);
    //   }

    // },
    children: [
      {
        path: '',
        name: 'product-list',
        component: ProductPageList
      }
      // {
      //   path: 'produto/:id/',
      //   name: 'product-details',
      //   component: ProductPageDetails
      // },
      // {
      //   path: 'produto/:id/dados-fiscais',
      //   name: 'product-tax-data-edit',
      //   component: ProductFormTaxDataEdit
      // },
    ]
  }
];
