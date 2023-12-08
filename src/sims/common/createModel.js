import { writable } from 'svelte/store';
import { createWorker } from './createWorker';
import { randomInt, randomUniform } from './utils';

// to be dynamically injecting helper scripts
const helperScripts = [randomInt, randomUniform];

export const createModel = ([init, step, modelParams, staticParams, title]) => {
  // title
  title = title || 'Model name...';

  // initialise model's data
  let params = { ...modelParams };
  let env = []; // environment 2D rray !!! to be generalized for other topologies
  let agents = []; // agents array

  // def model store
  const store = writable({ params, agents, env });
  const { subscribe, set } = store;

  // inline workers for init function and step function
  const workerInit = createWorker(init, helperScripts);
  const workerStep = createWorker(step, helperScripts);

  // Helper functions
  const update = (params, data) => {
    agents = data.agents;
    env = data.env;
    set({ params, agents, env });
  };

  // model API functions
  const modelInit = async () => {
    return workerInit.run({ params })
      .then(({ data }) => update(params, data)) // worker.onemessage
      .catch(console.log); // worker.onerror
  };

  const modelStep = async () => {
    return workerStep.run({ params, agents, env })
      .then(({ data }) => update(params, data))
      .catch(console.log);
  };

  const dispose = () => {
    console.log('Discard model: empty agents and env array; terminate the workers');
    agents = [];
    env = [];
    workerInit && workerInit.terminate();
    workerStep && workerStep.terminate();
  };

  const changeParams = (newParams) => {
    params = { ...params, ...newParams };
    set(({ params, agents, env }));
  };

  return { subscribe, init: modelInit, step: modelStep, dispose, changeParams, staticParams, title };
};

