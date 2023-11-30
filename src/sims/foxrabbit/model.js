import { createModel } from '../common/modelFactory';
import { randomInt, randomUniform } from '../common/utils';

// const nAgents = 130;
// const wDim = 1;
const modelParams = {
  nr: 500.0, // carrying capacity of rabbits
  r_init: 100, // initial rabbit population
  mr: 0.03, // magnitude of movement of rabbits
  // dr: 1.0, // death rate of rabbits when facing foxes
  dr: 0.95, // death rate of rabbits when facing foxes
  // rr: 0.1, // reproduction rate of rabbits
  rr: 0.5, // reproduction rate of rabbits

  f_init: 30, // initial fox population
  mf: 0.05, // magnitude of movement of foxes
  df: 0.1, // death rate of foxes when there is no food
  // rf: 0.5, // reproduction rate of foxes
  rf: 0.1, // reproduction rate of foxes

  cdsq: 0.02 * 0.02 // radius for collision detection
};

// Helpers
const createAgent = (type) => ({ type, x: Math.random(), y: Math.random() });

// { n, w, params, agents } -> {agents}
const updateOneAgent = ({ n, w, params }, agents) => {
  const { nr, mr, dr, rr, mf, df, rf, cdsq } = params;

  const len = agents.length;
  if (len === 0) return;

  const idx = randomInt(len);
  const ag = agents[idx];

  // Simulating random movement
  const m = ag.type === 'r' ? mr : mf;
  ag.x += randomUniform(m); // uniform(-m, m);
  ag.y += randomUniform(m); // uniform(-m, m);
  if (ag.x > 1) ag.x = 1;
  if (ag.x < 0) ag.x = 0;
  if (ag.y > 1) ag.y = 1;
  if (ag.y < 0) ag.y = 0;

  // Detecting collision and simulating death or birth
  const neighbors = agents.filter(nb =>
    nb.type !== ag.type && (ag.x - nb.x) ** 2 + (ag.y - nb.y) ** 2 < cdsq
  ); // agents of OTHER type within distance of 'cdsq'

  if (ag.type === 'r') {
    if (neighbors.length > 0 && Math.random() < dr) {
      agents.splice(idx, 1); // delete died agent
      return;
    }

    if (Math.random() < rr * (1 - agents.filter(x => x.type === 'r').length / nr)) {
      agents.push({ ...ag }); // new agent was born
    }
    return;
  }
  // ag.type === 'f'
  if (neighbors.length === 0 && Math.random() < df) {
    agents.splice(idx, 1); // delete died agent
    return;
  }
  if (Math.random() < rf) {
    agents.push({ ...ag }); // new agent was born: same type, same place
  }
  return;
};

// { n, w, params } -> {agents, env}
const init = ({ n, w, params }) => {
  const { r_init, f_init } = params; // r_init + f_init should equal nAgents
  const rabbits = Array.from({ length: r_init }, () => createAgent('r'));
  const foxes = Array.from({ length: f_init }, () => createAgent('f'));
  return { agents: rabbits.concat(foxes) };
};

// { n, w, params, agents, env } -> {agents, env}
const step = ({ n, w, params, agents, env }) => {
  let t = 0.0;
  while (t < 1.0 && agents.length > 0) {
    t += 1.0 / agents.length;
    updateOneAgent({ n, w, params }, agents);
  }
  return { agents };
};

const model = createModel([init, step, modelParams]);

export default model;