<script>
  import VizParamInput from './VizParamInput.svelte';

  export let asyncModel;
  export let sim;

  $: modelSpecialInputs = asyncModel.staticParams();
  $: isRunning = $sim.running;

  const changeHandler = (newParams) => {
    asyncModel.changeParams(newParams);
    sim.reset(asyncModel);
  };
</script>

<div class="params">
  {#each modelSpecialInputs as iName}
    <VizParamInput
      params={$asyncModel.params}
      key={iName}
      changeParams={changeHandler}
      {isRunning}
    />
  {/each}
</div>

<style>
  .params {
    width: 100%;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
</style>
