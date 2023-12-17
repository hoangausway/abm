import { randomInt } from '@common/utils';

// Helpers
const createAgent = () => ({ x: Math.random(), y: Math.random(), type: randomInt(2) });

const neighborhood = (r, ag) => {
  return (nb) => nb !== ag && (Math.pow(ag.x - nb.x, 2) + Math.pow(ag.y - nb.y, 2) < Math.pow(r, 2));
};
const teleportAgent = (ag) => {
  console.log(`Moving type ${ag.type} FROM (${ag.x}, ${ag.y})`);
  ag.x = Math.random();
  ag.y = Math.random();
  console.log(`TO (${ag.x}, ${ag.y})`);
};

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

// { params, agents, env } -> {agents, env}
const step = ({ params, agents }) => {
  const { r, th } = params;

  // pick a random agent
  let agent = agents[randomInt(agents.length)];

  // get neighborhood
  let neighbors = agents.filter(neighborhood(r, agent));

  // estimate does agent need to move
  if (neighbors.length > 0) {
    const nbs = neighbors.filter((nb) => nb.type === agent.type);
    const q = nbs.length / neighbors.length;
    q < th && teleportAgent(agent);
  }
  return { agents };
};
