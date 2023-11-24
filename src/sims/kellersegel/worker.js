import registerPromiseWorker from 'promise-worker/register';

// Helpers
// Helpers
const randomInt = (max) => Math.floor(Math.random() * max);

const zeroSquareMatrix = (size) => Array.from({ length: size }, () => Array.from({ length: size }, () => 0));;
const createAgent = (size) => ({ x: randomInt(size), y: randomInt(size) });
const createAgents = (n, w) => Array.from({ length: n }, () => createAgent(w));

const initCalculation = ({ n, w, params }) => {
  const env = zeroSquareMatrix(w);
  const agents = createAgents(n, w);
  return { env, agents };
};

const stepCalculation = ({ w, params, agents, env }) => {
  console.log('w', { w, params, agents, env });
  const { Dh, Dc, Dt, k, f } = params;

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
      env[x][y] = env[x][y] + (-k * C + Dc * lap) * Dt;
    }
  }

  // Simulating secretion of cAMP by agents
  for (const ag of agents) {
    env[ag.x][ag.y] += f * Dt;
  }

  // Simulating chemotaxis of agents
  for (const ag of agents) {
    let newx = (ag.x + randomInt(3) - 1) % w;
    let newy = (ag.y + randomInt(3) - 1) % w;
    if (newx < 0) newx = w + newx;
    if (newy < 0) newy = w + newy;

    const diff = (env[newx][newy] - env[ag.x][ag.y]) / 0.1;

    if (Math.random() < Math.exp(diff) / (1 + Math.exp(diff))) {
      ag.x = newx;
      ag.y = newy;
    }
  }
  return { env, agents };
};

registerPromiseWorker(({ type, data }) => {
  if (type === 'INIT')
    return initCalculation(data);
  else if (type === 'STEP') {
    return stepCalculation(data);
  }
  return [];
});