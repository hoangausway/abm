import { writable } from 'svelte/store';

export const createSimStore = () => {
  /*
    Model: {agents, init, step, dispose}
  */
  // Simulation parameters
  let running = false;
  let step = 0;
  let timer = null;
  let timeInterval = 100;

  // Define the simulation state store, for outside subscription
  const store = writable({ running, step, timer, timeInterval });
  const { subscribe, set } = store;

  // Helper
  const clearTimer = () => {
    timer && clearTimeout(timer);
    return null;
  };

  const modelForward = async (model) => {
    step++;
    // set store data
    set({ running, step, timeInterval });

    // await till model has completed a step
    console.log(`Sim: running step ${step}... `);
    await model.step();

    // setup for next continuosly stepping
    console.log(`Sim: step ${step} done`);
    if (running) {
      console.log(`Sim: scheduled for next step ${step + 1} in: ${timeInterval} ...`);
      timer = setTimeout(() => modelForward(model), timeInterval);
    }
  };

  /* --- Simulator interface ---
    - subscribe (for reactive data {running, step, timeInterval})
    - runOrPause
    - stepOnce
    - reset
    - destroy
    - init
    - changeTimeInterval
  */
  // to run or pause the steps
  const runOrPause = async (model) => {
    // clear timeout of the running loop
    timer = clearTimer();
    running = !running;
    set({ running, step, timeInterval });

    if (running) modelForward(model);
  };

  // to step once
  const stepOnce = async (model) => {
    // clear timeout of the running loop
    timer = clearTimer();
    running = false;
    set({ running, step, timeInterval });

    modelForward(model);
  };

  // to reset model and ready to simulate from beginning
  const reset = async (model) => {
    // clear timeout of the running loop
    timer = clearTimer();
    step = 0;
    running = false;
    set({ running, step, timeInterval });
    await model.init();
  };

  const init = async (model) => {
    await model.init();
  };

  const destroy = async (model) => {
    timer = clearTimer();
    running = false;
    step = 0;
    // Keep latest timeInterval value un changed
    set({ running, step, timeInterval });

    await model.dispose();
  };

  const changeTimeInterval = (interval) => {
    timeInterval = interval;
    set({ running, step, timeInterval });
  };

  return {
    ...store,
    runOrPause,
    stepOnce,
    reset,
    init,
    destroy,
    changeTimeInterval
  };
};