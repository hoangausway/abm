import PromiseWorker from 'promise-worker';
import { createModel } from '../simcontrols/modelFactory';

const worker = new PromiseWorker(new Worker(new URL('./worker', import.meta.url), { type: 'module' }));

// store
let env = [];
let agents = [];
let nAgents = 500;
let wDim = 100; // number of rows/columns in spatial array
let modelParams = { r: 0.1, th: 0.5 };

const promiseInit = ({ n, w, params }) => {
  return worker.postMessage({ type: 'INIT', data: { n } })
    .catch(console.log);
};

const promiseStep = ({ w, params, agents, env }) => {
  return worker.postMessage({ type: 'STEP', data: { w, params, agents, env } })
    .catch(console.log);
};

const model = createModel([promiseInit, promiseStep, modelParams, nAgents, wDim]);

export default model;