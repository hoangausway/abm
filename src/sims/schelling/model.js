import { createModel } from '../simcontrols/modelFactory';

// initial parameters
let nAgents = 500;
let wDim = 100; // number of rows/columns in spatial array
let modelParams = { r: 0.1, th: 0.5 };

// behaviors
// Helpers
const randomInt = (max) => Math.floor(Math.random() * max);
const createAgent = () => ({ type: randomInt(2), x: Math.random(), y: Math.random() });
const createAgents = (n) => Array.from({ length: n }, () => createAgent());

// { n, w, params } -> {agents, env}
const init = ({ n, w, params }) => {
  return { agents: createAgents(n) };
};

// { n, w, params, agents, env } -> {agents, env}
const step = ({ n, w, params, agents, env }) => {
  const { r, th } = params;

  // pick a random agent
  let ag = agents[randomInt(agents.length)];

  // define neighborhood
  let neighbors = agents.filter(function (nb) {
    return nb !== ag && (Math.pow(ag.x - nb.x, 2) + Math.pow(ag.y - nb.y, 2) < Math.pow(r, 2));
  });

  if (neighbors.length > 0) {
    // estimate does agent need to move
    let q = neighbors.filter(function (nb) {
      return nb.type === ag.type;
    }).length / neighbors.length;

    if (q < th) { // move
      console.log(`Moving type ${ag.type} FROM (${ag.x}, ${ag.y})`);
      ag.x = Math.random();
      ag.y = Math.random();
      console.log(`TO (${ag.x}, ${ag.y})`);
    }
  }
  return { agents };
};

const model = createModel([init, step, modelParams, nAgents, wDim]);

export default model;