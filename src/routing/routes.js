import NotFound from '../components/NotFound.svelte';

import Login from '../components/Login.svelte';
import Home from '../components/Home.svelte';
import Private from '../components/Private.svelte';

import ABMFoxRabbit from '../sims/foxrabbit/ABMFoxRabbit.svelte';
import ABMFoxRabbitParams from '../sims/foxrabbit/ABMFoxRabbitParams.svelte';

import ABMSchelling from '../sims/schelling/ABMSchelling.svelte';
import ABMKellerSegel from '../sims/kellersegel/ABMKellerSegel.svelte';

export const loginPath = '/login';

const onlineRoutes = {
  '/abm/schelling': {
    component: ABMSchelling
  },
  '/abm/kellersegel': {
    component: ABMKellerSegel
  },
  '/': {
    component: Home,
    left: ABMFoxRabbit,
    right: ABMFoxRabbitParams
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