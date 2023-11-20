import NotFound from '../components/NotFound.svelte';

import Login from '../components/Login.svelte';
import Home from '../components/Home.svelte';
import Private from '../components/Private.svelte';

import ABMSchelling from '../components/ABMSchelling.svelte';
import ABMKellerSegel from '../components/ABMKellerSegel.svelte';

export const loginPath = '/login';

const onlineRoutes = {
  '/abm/schelling': {
    component: ABMSchelling,
    model: 'modelSchelling',
    viz: 'VizSchelling',
    vizParams: 'VizParams'
  },
  '/abm/kellersegel': {
    component: ABMKellerSegel,
    model: 'modelKellerSegel',
    viz: 'VizKellerSegel'
  },
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