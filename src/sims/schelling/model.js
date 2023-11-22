import { writable } from 'svelte/store';
import PromiseWorker from 'promise-worker';

const worker = new PromiseWorker(new Worker(new URL('./worker', import.meta.url), { type: 'module' }));

let agents = [];
let n = 500;
let params = { r: 0.1, th: 0.5 };

const store = writable({ params, n, agents });
const { subscribe, set } = store;

const promiseInit = (n) => {
  console.log('N', n);
  return worker.postMessage({ type: 'INIT', data: { n } })
    .catch(console.log);
};

const promiseStep = ({ r, th, n, agents }) => {
  return worker.postMessage({ type: 'STEP', data: { r, th, n, agents } })
    .catch(console.log);
};

// Behaviors
const init = async () => {
  console.log('Model INIT', n, { ...params });
  agents = await promiseInit(n);
  store.set({ params, n, agents });
};

const step = async () => {
  console.log('Model step START', n, { ...params });

  agents = await promiseStep({ ...params, n, agents });
  store.set({ params, n, agents });

  console.log('Model step DONE');
};

const dispose = () => {
  console.log('Discard model');
  agents = [];
};

const changeParams = (newParams) => {
  console.log('Change parameters');
  params = { ...newParams };
  set(({ params, n, agents }));
};

const changeN = (N) => {
  console.log('Change N', N);
  n = N;
  set(({ params, n, agents }));
};

export default { subscribe, init, step, dispose, changeParams, changeN };
