import { createModel } from '../common/modelFactory';
import { randomInt } from '../common/utils';

const modelParams = { n: 500, r: 0.1, th: 0.5 };
const staticParams = () => ['n'];

// { params } -> {agents, env}
const init = ({ params }) => {
// Helpers
const createAgent = () => ({ type: randomInt(2), x: Math.random(), y: Math.random() });

  const agents = Array.from({ length: params.n }, () => createAgent());
  return { agents };
};

// { params, agents, env } -> {agents, env}
const step = ({ params, agents }) => {
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

const model = createModel([init, step, modelParams, staticParams]);

export default model;