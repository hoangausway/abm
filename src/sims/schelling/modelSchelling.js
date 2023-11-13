const randomInt = (max) => Math.floor(Math.random() * max);

let flagStepDone = true; // to flag if the step process done

const n = 1000; // number of agents
const r = 0.1; // neighborhood radius
const th = 0.5; // threshold for moving
// const n = 500; // number of agents
// const r = 0.1; // neighborhood radius
// const th = 0.5; // threshold for moving

const agents = [];

const init = () => {
  console.log('Model init');
  for (let i = 0; i < n; i++) {
    agents[i] = { type: randomInt(2), x: Math.random(), y: Math.random() };
  }
};

const doStep = () => {
  // pick a random agent
  let ag = agents[randomInt(agents.length)];

  // define neighborhood
  let neighbors = agents.filter(function (nb) {
    return (Math.pow(ag.x - nb.x, 2) + Math.pow(ag.y - nb.y, 2) < Math.pow(r, 2)) && nb !== ag;
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
};

const step = () => {
  console.log('Model step START');
  flagStepDone = false;
  doStep();
  console.log('Model step DONE');
  flagStepDone = true;
};

const dispose = () => {
  console.log('Discard model');
};

const model = { agents, init, step, dispose, flagStepDone, params: { n, r, th } };
export default model;