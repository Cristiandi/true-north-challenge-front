import { createRouter, createWebHashHistory } from 'vue-router';
import { getAuth } from 'firebase/auth';

import firebaseApp from '../firebase';

// views
import LoggedOut from '../views/LoggedOut.vue';
import Register from '../views/Register.vue';
import Login from '../views/Login.vue';
import Home from '../views/Home.vue';
import Records from '../views/Records.vue';

const routes = [
  {
    path: '/',
    name: 'LoggedOut',
    component: LoggedOut
  },
  {
    path: '/register',
    name: 'Register',
    component: Register
  },
  {
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/records',
    name: 'Records',
    component: Records,
    meta: {
      requiresAuth: true
    }
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

router.beforeEach((to, from, next) => {
  const requiresAuth = to.matched.some(x => x.meta.requiresAuth);

  const auth = getAuth(firebaseApp);

  if (requiresAuth && !auth.currentUser) {
    return next('/');
  } else if (!requiresAuth && auth.currentUser) {
    return next('/home');
  } else {
    return next();
  }
});

export default router;
