<script>
  import { onMount } from 'svelte';

  export let asyncModel;
  export let sim;
  export let Info;

  $: title = asyncModel && asyncModel.title();
  $: isRunning = $sim.running;
  $: step = $sim.step;
  $: timeInterval = $sim.timeInterval;

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
  <div class="container">
    <div class="title">
      <svelte:component this={Info} {title} />
      <div class="right">
        <div>
          <span>#:</span>
          <span>{step}</span>
        </div>
        <div class="time">
          <input
            aria-label="time"
            value={timeInterval}
            bind:this={elmInput}
            placeholder="time interval"
          />
          <span>ms</span>
          <button on:click|preventDefault={changeTimeInterval}>
            {timeInterval}
          </button>
        </div>
      </div>
    </div>
    <div class="controls">
      <button on:click={startHandler}> {isRunning ? 'Pause' : 'Run'} </button>
      <button on:click={stepOnceHandler}>Step</button>
      <button on:click={resetHandler}>Reset</button>
    </div>
  </div>
{/if}

<style>
  .container {
    margin: 1rem 0;
    padding: 0;
  }
  .title {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 1rem 0;
  }
  .right {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .right > :nth-child(1) {
    width: 6rem;
    font-family: monospace;
    font-size: 0.75rem;
  }
  .right .time {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .right .time > input {
    height: 2rem;
    margin: 0;
    padding: 6px;
    border: none;
    border-bottom: 1px solid #ccc;
    text-align: right;
    font-family: monospace;
    font-size: 0.75rem;
  }
  .right .time > span {
    margin-left: 0.25rem;
    margin-right: 0.5rem;
    font-family: monospace;
    font-size: 0.75rem;
  }
  .right .time > button {
    height: 2rem;
    line-height: 0.5;
    font-family: monospace;
    font-size: 0.75rem;
  }

  .controls {
    box-sizing: border-box;
    padding-right: 0.4rem;
    display: grid;
    align-items: center;
    grid-template-columns: 35% 30% 35%;
    column-gap: 3px;
  }
</style>
