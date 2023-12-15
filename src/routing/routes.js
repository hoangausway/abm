import NotFound from '../components/NotFound.svelte';

import Login from '../components/Login.svelte';
import Home from '../components/Home.svelte';
import Private from '../components/Private.svelte';

import Schelling from '../sims/vizs/schelling/Schelling.svelte';
import KellerSegel from '../sims/vizs/kellersegel/KellerSegel.svelte';
import FoxRabbit from '../sims/vizs/foxrabbit/FoxRabbit.svelte';

export const loginPath = '/login';

const onlineRoutes = {
  '/abm/schelling': {
    component: Schelling,
  },
  '/abm/kellersegel': {
    component: KellerSegel
  },
  '/abm/foxrabbit': {
    component: FoxRabbit
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