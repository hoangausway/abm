import { writable } from 'svelte/store';
import PromiseWorker from 'promise-worker';

const worker = new PromiseWorker(new Worker(new URL('./worker', import.meta.url), { type: 'module' }));

// store
let env = [];
let agents = [];
let n = 1000;
let w = 100; // number of rows/columns in spatial array
let params = {
  k: 1, // rate of cAMP decay
  Dc: 0.001, // diffusion constant of cAMP
  Dh: 0.01, // spatial resolution for cAMP simulation
  Dt: 0.01, // time resolution for cAMP simulation
  f: 1 // rate of cAMP secretion by an agent
};

const store = writable({ params, n, w, agents, env });
const { subscribe, set } = store;

const promiseInit = ({ n, w }) => {
  return worker.postMessage({ type: 'INIT', data: { n, w } })
    .catch(console.log);
};

const promiseStep = ({ w, params, agents, env }) => {
  return worker.postMessage({ type: 'STEP', data: { w, params, agents, env } })
    .catch(console.log);
};

// Behaviors
const init = async () => {
  console.log('Model init');
  const res = await promiseInit({ n, w });
  agents = res.agents;
  env = res.env;
  set({ params, n, w, agents, env });
};

const step = async () => {
  console.log('Model step START');
  const res = await promiseStep({ w, params, agents, env });
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



export default { subscribe, init, step, dispose, changeParams, changeN, changeW };
