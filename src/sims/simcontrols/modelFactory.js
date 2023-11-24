import { writable } from 'svelte/store';

export const createModel = ([init, step, modelParams, nAgents, wDim]) => {
  let n = nAgents;
  let w = wDim; // number of rows/columns in spatial array. To be redefined for xDim and yDim
  let params = { ...modelParams };

  let env = []; // environment 2D rray !!! to be generalized for othe topologies
  let agents = []; // agents array

  const store = writable({ params, n, w, agents, env });
  const { subscribe, set } = store;

  const modelInit = async () => {
    return Promise.resolve({ n, w, params })
      .then(data => init(data)) // init returns res = {agents, env}
      .then(res => {
        agents = res.agents;
        env = res.env;
        set({ params, n, w, agents, env });
      })
      .catch(console.log);
  };

  const modelStep = async () => {
    return Promise.resolve({ params, n, w, agents, env })
      .then(data => step(data)) // step returns res = {agents, env}
      .then(res => {
        agents = res.agents;
        env = res.env;
        set({ params, n, w, agents, env });
      })
      .catch(console.log);
  };

  const dispose = () => {
    console.log('Discard model');
    agents = [];
    env = [];
  };

  const changeParams = (newParams) => {
    params = { ...newParams };
    set(({ params, n, w, agents, env }));
  };

  const changeN = (N) => {
    n = N;
    set(({ params, n, w, agents, env }));
  };

  const changeW = (W) => {
    w = W;
    set(({ params, n, w, agents, env }));
  };

  return { subscribe, init: modelInit, step: modelStep, dispose, changeParams, changeN, changeW };
};

