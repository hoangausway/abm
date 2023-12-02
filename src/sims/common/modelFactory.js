import { writable } from 'svelte/store';

export const createModel = ([init, step, modelParams, staticParams]) => {
  let params = { ...modelParams };

  let env = []; // environment 2D rray !!! to be generalized for othe topologies
  let agents = []; // agents array

  const store = writable({ params, agents, env });
  const { subscribe, set } = store;

  const modelInit = async () => {
    return Promise.resolve({ params })
      .then(init) // data -> {agents, env}
      .then(response => {
        agents = response.agents;
        env = response.env;
        set({ params, agents, env });
      })
      .catch(console.log);
  };

  const modelStep = async () => {
    return Promise.resolve({ params, agents, env })
      .then(step) // data -> {agents, env}
      .then(response => {
        agents = response.agents;
        env = response.env;
        set({ params, agents, env });
      })
      .catch(console.log);
  };

  const dispose = () => {
    console.log('Discard model');
    agents = [];
    env = [];
  };

  // TO REVIEW HOW TO APPLY CHANGES OF 'n' and 'w'.
  // n and w should not change while in step function running!
  const changeParams = (newParams) => {
    params = { ...params, ...newParams };
    set(({ params, agents, env }));
  };

  return { subscribe, init: modelInit, step: modelStep, dispose, changeParams, staticParams };
};

