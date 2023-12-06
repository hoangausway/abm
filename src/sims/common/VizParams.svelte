<script>
  import VizParamInput from './VizParamInput.svelte';

  export let asyncModel;

  const staticParams = asyncModel.staticParams();
  $: inputParams = Object.keys($asyncModel.params).reduce((acc, par) => {
    return staticParams.includes(par)
      ? acc
      : { ...acc, [par]: $asyncModel.params[par] };
  }, {});

  const changeHandler = (newparams) => {
    asyncModel.changeParams(newparams);
  };
</script>

{#if inputParams}
  <div class="params">
    {#each Object.keys(inputParams) as par}
      <VizParamInput
        params={inputParams}
        key={par}
        changeParams={changeHandler}
      />
    {/each}
  </div>
{/if}

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
