<script>
  import { onMount } from 'svelte';
  import { createSimStore } from '../common/simStoreFactory';
  import VizParamInput from '../common/VizParamInput.svelte';

  export let model;

  const sim = createSimStore();

  $: isRunning = $sim.running;
  $: step = $sim.step;
  $: timeInterval = $sim.timeInterval;

  $: modelSpecialInputs = model.staticParams();

  let elmInput;

  const startHandler = () => {
    sim.runOrPause(model);
  };

  const stepOnceHandler = () => {
    sim.stepOnce(model);
  };

  const resetHandler = () => {
    sim.reset(model);
  };

  const changeTimeInterval = () => {
    const value = parseInt(elmInput.value);
    if (typeof value === 'number' && value >= 0) {
      sim.changeTimeInterval(value);
    }
  };

  onMount(() => {
    sim.init(model);
    return () => sim.destroy(model);
  });
</script>

{#if sim}
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
    <form>
      {#each modelSpecialInputs as iName}
        <VizParamInput
          params={$model.params}
          key={iName}
          changeParams={model.changeParams}
          {isRunning}
        />
      {/each}
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
