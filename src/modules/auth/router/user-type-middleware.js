export default async (to, from, next) => {
    const userType = window.localStorage.getItem('user-type');

    const ordersRoute = {
        path: '/pedidos',
        query: { redirect: to.fullPath },
    };

    if (userType == 'clerk') {
        return next(ordersRoute);
    } else if (userType == 'default' || userType == 'admin' ){
        return next();
    }
};