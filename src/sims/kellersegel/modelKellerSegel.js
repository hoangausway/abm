import { writable } from 'svelte/store';

// Helpers
const randomInt = (max) => Math.floor(Math.random() * max);

const zerosArr = (rows, cols) => Array.from({ length: rows }, () => Array.from({ length: cols }, () => 0));
const zeroSquareMatrix = (size) => Array.from({ length: size }, () => Array.from({ length: size }, () => 0));;

const createAgent = (size) => ({ x: randomInt(size), y: randomInt(size) });

// store
const initial = {
  params: {
    w: 100, // number of rows/columns in spatial array

    k: 1, // rate of cAMP decay
    Dc: 0.001, // diffusion constant of cAMP
    Dh: 0.01, // spatial resolution for cAMP simulation
    Dt: 0.01, // time resolution for cAMP simulation
    f: 1 // rate of cAMP secretion by an agent
  },
  n: 1000, // number of agents
  agents: [],
  env: []
};

const { subscribe, update } = writable(initial);

// Behaviors
const init = () => {
  console.log('Model init');
  update(state => {
    const { n, params } = state;
    const { w } = params;

    const agents = Array.from({ length: n }, () => createAgent(w));
    const env = zeroSquareMatrix(w);

    return { params, n, agents, env };
  });
};

const step = () => {
  console.log('Model step START');
  update(state => {
    const { n, params, agents } = state;
    const { w, Dh, Dc, Dt, k, f } = params;

    // Simulating diffusion and evaporation of cAMP
    let env = state.env;

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
      // let newx = (ag.x + randomInt(3) - 1 + w) % w;
      // let newy = (ag.y + randomInt(3) - 1 + w) % w;
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
    return { params, n, agents, env };
  });
  console.log('Model step DONE');
};

const dispose = () => {
  console.log('Discard model');
  update(state => ({ params: state.params, n: state.n, agents: [], env: [], nextenv: 0 }));
};

const changeParams = (newParams) => {
  console.log('Change parameters');
  update(state => ({ ...state, params: { ...state.params, ...newParams } }));
};

export default { subscribe, init, step, dispose, changeParams };
