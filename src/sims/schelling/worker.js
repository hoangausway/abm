import registerPromiseWorker from 'promise-worker/register';

// Helpers
const randomInt = (max) => Math.floor(Math.random() * max);
const createAgent = () => ({ type: randomInt(2), x: Math.random(), y: Math.random() });
const createAgents = (n) => Array.from({ length: n }, () => createAgent());

const initCalculation = createAgents;

const stepCalculation = ({ r, th, n, agents }) => {
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
};

registerPromiseWorker(({ type, data }) => {
  if (type === 'INIT')
    return initCalculation(data.n);
  else if (type === 'STEP') {
    const { r, th, n, agents } = data;
    return stepCalculation({ r, th, n, agents });
  }
  return [];
});