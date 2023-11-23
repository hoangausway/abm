import PromiseWorker from 'promise-worker';
import { createModel } from '../simcontrols/modelFactory';

const worker = new PromiseWorker(new Worker(new URL('./worker', import.meta.url), { type: 'module' }));

// store
let env = [];
let agents = [];
let nAgents = 1000;
let wDim = 100; // number of rows/columns in spatial array
let modelParams = {
  k: 1, // rate of cAMP decay
  Dc: 0.001, // diffusion constant of cAMP
  Dh: 0.01, // spatial resolution for cAMP simulation
  Dt: 0.01, // time resolution for cAMP simulation
  f: 1 // rate of cAMP secretion by an agent
};

const promiseInit = ({ n, w, params }) => {
  return worker.postMessage({ type: 'INIT', data: { n, w } })
    .catch(console.log);
};

const promiseStep = ({ w, params, agents, env }) => {
  return worker.postMessage({ type: 'STEP', data: { w, params, agents, env } })
    .catch(console.log);
};

const model = createModel([promiseInit, promiseStep, modelParams, nAgents, wDim]);

export default model;