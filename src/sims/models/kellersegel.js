import { randomInt } from '@common/utils';

// void -> {title, params, specialParams}
const info = () => ({
  title: 'Keller-Segel',
  params: {
    n: 1000,
    w: 100,
    k: 1, // rate of cAMP decay
    Dc: 0.001, // diffusion constant of cAMP
    Dh: 0.01, // spatial resolution for cAMP simulation
    Dt: 0.01, // time resolution for cAMP simulation
    f: 1 // rate of cAMP secretion by an agent
  },
  staticParams: ['n', 'w']
});

// { params } -> {agents, env}
const init = ({ params }) => {
  // Helpers
  const createAgent = (size) => ({ x: randomInt(size), y: randomInt(size) });

  const { n, w } = params;
  const env = Array.from({ length: w }, () => Array.from({ length: w }, () => 0));
  const agents = Array.from({ length: n }, () => createAgent(w));
  return { env, agents };
};

// { params, agents, env } -> {agents, env}
const step = ({ params, agents, env }) => {
  const { n, w, Dh, Dc, Dt, k, f } = params;
  const nextenv = Array.from({ length: w }, () => Array.from({ length: w }, () => 0));
  // Simulating diffusion and evaporation of cAMP
  for (let x = 0; x < w; x++) {
    for (let y = 0; y < w; y++) {
      const C = env[x][y];
      const R = env[(x + 1) % w][y];
      const L = env[(x - 1 + w) % w][y];
      const U = env[x][(y + 1) % w];
      const D = env[x][(y - 1 + w) % w];

      const lap = (R + L + U + D - 4 * C) / (Dh ** 2);

      // update env at point (x, y)
      nextenv[x][y] = env[x][y] + (-k * C + Dc * lap) * Dt;
    }
  }

  // Simulating secretion of cAMP by agents
  for (const ag of agents) {
    nextenv[ag.x][ag.y] += f * Dt;
  }

  // Simulating chemotaxis of agents
  for (const ag of agents) {
    let newx = (ag.x + randomInt(3) - 1) % w;
    let newy = (ag.y + randomInt(3) - 1) % w;
    if (newx < 0) newx = w + newx;
    if (newy < 0) newy = w + newy;

    const diff = (nextenv[newx][newy] - nextenv[ag.x][ag.y]) / 0.1;

    if (Math.random() < Math.exp(diff) / (1 + Math.exp(diff))) {
      ag.x = newx;
      ag.y = newy;
    }
  }
  return { env: nextenv, agents };
};
