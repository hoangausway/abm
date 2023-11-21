import { get, writable } from 'svelte/store';

// Helpers
const randomInt = (max) => Math.floor(Math.random() * max);
const createAgent = () => ({ type: randomInt(2), x: Math.random(), y: Math.random() });
const createAgents = (n) => Array.from({ length: n }, () => createAgent());

let agents = [];
let n = 500;
let params = { r: 0.1, th: 0.5 };

const initial = { params, n, agents };

const store = writable(initial);
const { subscribe, set, update } = store;

const promiseInit = (n) => {
  console.log('N', n);
  return Promise.resolve()
    .then(() => createAgents(n));
};

const promiseStep = ({ r, th, n, agents }) => {
  return Promise.resolve()
    .then(() => {
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
      return agents;
    });
};

// Behaviors
const init = async () => {
  console.log('Model INIT', n, { ...params });
  agents = await promiseInit(n);
  store.set({ params, n, agents });
};

const step = async () => {
  console.log('Model step START', n, { ...params });

  agents = await promiseStep({ ...params, n, agents });
  store.set({ params, n, agents });

  console.log('Model step DONE');
};

const dispose = () => {
  console.log('Discard model');
  agents = [];
};

const changeParams = (newParams) => {
  console.log('Change parameters');
  params = { ...newParams };
  set(({ params, n, agents }));
};

const changeN = (N) => {
  console.log('Change N', N);
  n = N;
  set(({ params, n, agents }));
};

export default { subscribe, init, step, dispose, changeParams, changeN };
