<script>
  import { onMount } from 'svelte';
  import { createSimStore } from '../common/simStoreFactory';

  export let model;

  const simulator = createSimStore();

  $: isRunning = $simulator.running;
  $: step = $simulator.step;
  $: timeInterval = $simulator.timeInterval;

  let elmInput;

  const startHandler = () => {
    simulator.runOrPause(model);
  };

  const stepOnceHandler = () => {
    simulator.stepOnce(model);
  };

  const resetHandler = () => {
    simulator.reset(model);
  };

  const changeTimeInterval = () => {
    const value = parseInt(elmInput.value);
    if (typeof value === 'number' && value >= 0) {
      simulator.changeTimeInterval(value);
    }
  };

  onMount(() => {
    simulator.init(model);
    return () => simulator.destroy(model);
  });
</script>

{#if simulator}
  <article>
    <div class="controls">
      <button on:click={startHandler}> {isRunning ? 'Pause' : 'Run'} </button>
      <button on:click={stepOnceHandler}>Step</button>
      <button on:click={resetHandler}>Reset</button>
    </div>
    <form class="info">
      <div class="step">
        <span>Step:</span>
        <span>{step}</span>
      </div>
      <div class="time">
        <input
          value={timeInterval}
          bind:this={elmInput}
          placeholder="Time Interval"
        />
        <kbd on:click={changeTimeInterval}>{timeInterval}</kbd>
      </div>
    </form>
  </article>
{/if}

<style>
  .controls {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  button {
    margin: 3px;
  }
  .info {
    margin: 0 3px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .info .time {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .info .time > input {
    width: 5em;
    height: 1.8em;
    margin-top: 16px;
    margin-right: 6px;
  }
  .info .time > kbd {
    width: 5em;
    text-align: center;
  }
  .info .step {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .info .step :nth-child(1) {
    width: 3em;
  }
  .info .step :nth-child(2) {
    width: 5em;
    margin-right: 1rem;
    text-align: left;
  }
</style>
