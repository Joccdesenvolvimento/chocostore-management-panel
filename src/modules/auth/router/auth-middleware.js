export default async(to, from, next) => {
    if (to.matched.some((route) => route.meta.requiresAuth)) {
        const token = window.localStorage.getItem('auth-token');
        const loginRoute = {
            path: '/login',
            query: { redirect: to.fullPath },
        };

        if (token) {
            try {
                //await AuthService.login();
                return next();
            } catch (error) {
                console.log('Auto Login Error: ', error);
                return next(loginRoute);
            }
        }

        return next(loginRoute);
    }

    next();
};