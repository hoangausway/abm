import { writable, get } from 'svelte/store';

/*
  Model: {agents, init, step, dispose}
*/
// Initial
const initial = {
  running: false,
  step: -1,
  timer: null,
  timeInterval: 5
};

// Define the simulation state store
const store = writable(initial);

// Helper
const clearTimer = () => {
  const { timer } = get(store);
  if (timer) {
    clearTimeout(timer);
    store.update(state => ({ ...state, timer: null }));
  }
};


// private
const modelForward = (model) => {
  const { timeInterval } = get(store);

  // setup for next continuosly stepping
  const timerId = setTimeout(() => {
    modelForward(model);
  }, timeInterval);

  // if model step not done yet, skip for next modelForward call
  if (model.flagStepDone) {
    store.update(state => ({ ...state, timer: timerId, step: state.step + 1 }));
    model.step();
  }
};

// to run or pause the steps
const runOrPause = (model) => {
  const { running, step, timer } = get(store);

  // clear timeout of the running loop
  clearTimer();

  if (running) { // to pause
    store.update(state => ({ ...state, running: false }));
  } else { // to run
    store.update(state => ({ ...state, running: true }));
    modelForward(model);
  }
};

// to step once
const stepOnce = (model) => {
  const { step, timer } = get(store);

  // clear timeout of the running loop
  clearTimer();

  store.update(state => ({ ...state, running: false, step: step + 1 }));
  model.step();
};

// to reset model and ready to simulate from beginning
const resetModel = (model) => {
  const { step, timer } = get(store);

  // clear timeout of the running loop
  clearTimer();

  store.update(state => ({ ...state, running: false, step: 0 }));
  model.init();
};

const init = (model) => {
  store.update(state => ({ ...state, step: 0 }));
  model.init();
};

const destroy = (model) => {
  clearTimer();
  store.set(initial);
  model.dispose();
};

export default {
  ...store,
  runOrPause,
  stepOnce,
  resetModel,
  init,
  destroy
};