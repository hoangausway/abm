import { writable } from 'svelte/store';
import createWorker from './worker';
import { randomInt, randomUniform } from '../common/utils';

// to be dynamically injecting helper scripts
const helperScripts = [randomInt, randomUniform].map(fn => ({ name: fn.name, value: fn }));

export const createModel = ([init, step, modelParams, staticParams]) => {
  // initialise model's data
  let params = { ...modelParams };
  let env = []; // environment 2D rray !!! to be generalized for other topologies
  let agents = []; // agents array

  // def model store
  const store = writable({ params, agents, env });
  const { subscribe, set } = store;

  // inline workers for init function and step function
  const workerInit = createWorker(
    (e) => postMessage(init(e.data)),
    [...helperScripts, { name: init.name, value: init }]);

  const workerStep = createWorker(
    (e) => postMessage(step(e.data)),
    [...helperScripts, { name: step.name, value: step }]);

  // Helper function
  const update = (params, data) => {
    agents = data.agents;
    env = data.env;
    set({ params, agents, env });
  };

  // model API functions
  const modelInit = async () => {
    return workerInit.run({ params })
      .then(({ data }) => update(params, data))
      .catch(console.log);
  };

  const modelStep = async () => {
    console.log('modelStep workerStep', workerStep);
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

  // TO REVIEW HOW TO APPLY CHANGES OF 'n' and 'w'.
  // n and w should not change while in step function running!
  const changeParams = (newParams) => {
    params = { ...params, ...newParams };
    set(({ params, agents, env }));
  };

  return { subscribe, init: modelInit, step: modelStep, dispose, changeParams, staticParams };
};

