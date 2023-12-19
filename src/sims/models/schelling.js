import { randomInt } from '@common/utils';

// Helpers
const createAgent = () => ({ x: Math.random(), y: Math.random(), type: randomInt(2) });

// void -> {title, params, specialParams}
const info = () => ({
  title: 'Schelling',
  params: { n: 500, r: 0.1, th: 0.5 },
  staticParams: ['n']
});

// { params } -> {agents, env}
const init = ({ params }) => {
  const agents = Array.from({ length: params.n }, () => createAgent());
  return { agents };
};

// { params, agents, env } -> {agents, diff}
const step = ({ params, agents }) => {
  const { r, th } = params;

  // pick a random agent
  const agent = agents[randomInt(agents.length)];
  const { type, x, y } = agent;
  // diff
  const diff = { type, oldPos: { x, y } };

  // get neighborhood
  const neighbors = agents.filter((nb) => nb !== agent && (Math.pow(x - nb.x, 2) + Math.pow(y - nb.y, 2) < Math.pow(r, 2)));

  // estimate does agent need to move
  if (neighbors.length > 0) {
    const nbs = neighbors.filter((nb) => nb.type === type);
    const q = nbs.length / neighbors.length;
    if (q < th) {
      // teleport agent
      agent.x = Math.random();
      agent.y = Math.random();

      // diff
      diff['newPos'] = { x: agent.x, y: agent.y };
    }
  }
  return { agents, diff };
};
