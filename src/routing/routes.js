import NotFound from '../components/NotFound.svelte';

import Login from '../components/Login.svelte';
import Home from '../components/Home.svelte';
import Private from '../components/Private.svelte';

export const loginPath = '/login';

const onlineRoutes = {
  '/': {
    component: Home
  },
  '/private': {
    component: Private,
    private: true
  },
  '/login': {
    component: Login
  },
  '*': {
    component: NotFound
  }
};

const routes = onlineRoutes;

export default routes;