import { writable } from 'svelte/store';

// Helpers
const randomInt = (max) => Math.floor(Math.random() * max);

const initial = {
  params: { n: 500, r: 0.1, th: 0.5 },
  agents: []
};

const { subscribe, update } = writable(initial);

// Behaviors
const init = () => {
  console.log('Model init');
  update(state => {
    const { n, r, th } = state.params;
    const agents = [];
    for (let i = 0; i < n; i++) {
      agents[i] = { type: randomInt(2), x: Math.random(), y: Math.random() };
    }
    return { params: state.params, agents };
  });
};

const step = () => {
  console.log('Model step START');
  update(state => {
    const { params, agents } = state;
    const { n, r, th } = params;

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
    return { params, agents };
  });
  console.log('Model step DONE');
};

const dispose = () => {
  console.log('Discard model');
  update(state => ({ params: state.params, agents: [] }));
};

const changeParams = (newParams) => {
  console.log('Change parameters');
  update(state => {
    const params = { ...state.params, ...newParams };
    return ({ params, agents: state.agents });
  });
};

export default { subscribe, init, step, dispose, changeParams };
