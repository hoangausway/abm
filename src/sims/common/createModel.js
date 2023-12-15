import { writable } from 'svelte/store';
import { wrap } from 'comlink';

const createAsyncModel = (path) => {
  const model = wrap(
    new Worker(new URL(path, import.meta.url), { type: 'module' })
  );

  // initialise model's data
  let title = '';
  let staticParams = [];
  let params = {};
  let env = []; // environment 2D rray !!! to be generalized for other topologies
  let agents = []; // agents array

  // def model store
  const store = writable({ params, agents, env });
  const { subscribe, set } = store;

  // Helper functions
  const updateInfo = (info) => {
    title = info.title;
    staticParams = info.staticParams;
    params = info.params;
  };

  const update = (params, data) => {
    agents = data.agents;
    env = data.env;
    set({ params, agents, env });
  };

  // API functions
  const init = () => {
    return model
      .init({ params })
      .then((data) => update(params, data))
      .catch(console.log); // worker.onerror
  };
  const step = () => {
    return model
      .step({ params, agents, env })
      .then((data) => update(params, data))
      .catch(console.log); // worker.onerror
  };

  const dispose = () => {
    console.log(
      'Discard model: emptying agents and env arrays; terminates the workers'
    );
    agents = [];
    env = [];
    // To investigate do we need to terminate the model
    // return model.terminate();
  };

  const changeParams = (newParams) => {
    params = { ...params, ...newParams };
    set({ params, agents, env });
  };

  return model
    .info()
    .then(updateInfo)
    .then(() => ({
      subscribe,
      init,
      step,
      dispose,
      changeParams,
      staticParams: () => staticParams,
      title: () => title,
    }));
};

export default createAsyncModel;