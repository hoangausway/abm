<script>
  import { onMount } from 'svelte';
  import VizParamInput from './VizParamInput.svelte';

  export let asyncModel;
  export let sim;

  $: isRunning = $sim.running;
  $: step = $sim.step;
  $: timeInterval = $sim.timeInterval;

  $: modelSpecialInputs = asyncModel.staticParams();

  let elmInput;

  const startHandler = () => {
    sim.runOrPause(asyncModel);
  };

  const stepOnceHandler = () => {
    sim.stepOnce(asyncModel);
  };

  const resetHandler = () => {
    sim.reset(asyncModel);
  };

  const changeTimeInterval = () => {
    const value = parseInt(elmInput.value);
    if (typeof value === 'number' && value >= 0) {
      sim.changeTimeInterval(value);
    }
  };

  onMount(() => {
    sim.init(asyncModel);
    return () => sim.destroy(asyncModel);
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
        <button on:click|preventDefault={changeTimeInterval}>{timeInterval}</button>
      </div>
    </form>
    <form>
      {#each modelSpecialInputs as iName}
        <VizParamInput
          params={$asyncModel.params}
          key={iName}
          changeParams={asyncModel.changeParams}
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
    margin: 16px 6px;
    font-size: 0.8rem;
  }
  .info .time > button {
    width: 6em;
    text-align: center;
    font-family: monospace;
    font-size: 0.8rem;
    background-color: darkblue;
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
