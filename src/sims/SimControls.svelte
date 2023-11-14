<script>
  import { onMount } from 'svelte';
  import simulator from './simStore';

  export let model;

  let value = $simulator.timeInterval;
  let elmInput;

  $: isRunning = $simulator && $simulator.running;
  $: step = $simulator && $simulator.step;

  const startHandler = () => {
    simulator.runOrPause(model);
  };

  const stepOnceHandler = () => {
    simulator.stepOnce(model);
  };

  const resetHandler = () => {
    simulator.resetModel(model);
  };

  onMount(() => {
    simulator.init(model);
    return () => simulator.destroy(model);
  });

  const changeTimeInterval = () => {
    $simulator.timeInterval = parseInt(elmInput.value);
    $simulator = $simulator;
  };
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
        <span>STEP:</span>
        <span>{step}</span>
      </div>
      <div class="time">
        <input {value} bind:this={elmInput} placeholder="Time Interval" />
        <kbd on:click={changeTimeInterval}>{$simulator.timeInterval}</kbd>
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
    width: 100%;
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
    height: 32px;
    margin-top: 16px;
    margin-right: 6px;
  }
  .info .time > kbd {
    width: 100px;
    text-align: center;
  }
  .info .step {
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .info .step :nth-child(1) {
    width: 3rem;
  }
  .info .step :nth-child(2) {
    width: 3rem;
    margin-right: 1rem;
    text-align: right;
  }
</style>
