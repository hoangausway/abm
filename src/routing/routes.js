import NotFound from '../components/NotFound.svelte';

import Login from '../components/Login.svelte';
import Home from '../components/Home.svelte';
import Private from '../components/Private.svelte';

import ABMFoxRabbit from '../sims/foxrabbit/ABMFoxRabbit.svelte';
import VizFoxRabbit from '../sims/foxrabbit/VizFoxRabbit.svelte';

import ABMSchelling from '../sims/schelling/ABMSchelling.svelte';
import VizSchelling from '../sims/schelling/VizSchelling.svelte'

import ABMKellerSegel from '../sims/kellersegel/ABMKellerSegel.svelte';
import VizKellerSegal from '../sims/kellersegel/VizKellerSegal.svelte'

export const loginPath = '/login';

const onlineRoutes = {
  '/abm/schelling': {
    component: ABMSchelling,
    left: ABMSchelling,
    right: VizSchelling
  },
  '/abm/kellersegel': {
    component: ABMKellerSegel,
    left: ABMKellerSegel,
    right: VizKellerSegal
  },
  '/': {
    component: Home,
    left: ABMFoxRabbit,
    right: VizFoxRabbit
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