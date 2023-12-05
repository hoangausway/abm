<script>
  import VizParamInput from './VizParamInput.svelte';

  export let asyncModel;

  const staticParams = asyncModel.staticParams();
  $: inputParams = Object.keys($asyncModel.params).reduce((acc, par) => {
    return staticParams.includes(par)
      ? acc
      : { ...acc, [par]: $asyncModel.params[par] };
  }, {});
  $: changeParams = asyncModel.changeParams;
</script>

<div class="params">
  {#if inputParams}
    <hr />
    {#each Object.keys(inputParams) as par}
      <VizParamInput params={inputParams} key={par} {changeParams} />
    {/each}
  {/if}
</div>

<style>
  .params {
    padding: 0.7em;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: flex-end;
  }
</style>
