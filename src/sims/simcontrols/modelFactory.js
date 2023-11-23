import { writable } from 'svelte/store';

export const createModel = ([promiseInit, promiseStep, modelParams, nAgents, wDim]) => {
  let n = nAgents;
  let w = wDim; // number of rows/columns in spatial array
  let params = { ...modelParams };
  let env = [];
  let agents = [];

  console.log('pars', modelParams);
  console.log('params', params);

  const store = writable({ params, n, w, agents, env });
  const { subscribe, set } = store;

  const init = async () => {
    console.log('Model init');
    const res = await promiseInit({ n, w, params }); // res = {agents, env}
    agents = res.agents;
    env = res.env;
    set({ params, n, w, agents, env });
  };

  const step = async () => {
    console.log('Model step START');
    const res = await promiseStep({ params, n, w, agents, env }); // res = {agents, env}
    agents = res.agents;
    env = res.env;
    set({ params, n, w, agents, env });
    console.log('Model step DONE');
  };

  const dispose = () => {
    console.log('Discard model');
    agents = [];
    env = [];
  };

  const changeParams = (newParams) => {
    console.log('Change parameters');
    params = { ...newParams };
    set(({ params, n, w, agents, env }));
  };

  const changeN = (N) => {
    console.log('Change N', N);
    n = N;
    set(({ params, n, w, agents, env }));
  };

  const changeW = (W) => {
    console.log('Change W', W);
    w = W;
    set(({ params, n, w, agents, env }));
  };

  return { subscribe, init, step, dispose, changeParams, changeN, changeW };
};

