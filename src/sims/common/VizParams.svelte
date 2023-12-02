<script>
  import VizParamInput from './VizParamInput.svelte';

  export let model;

  const staticParams = model.staticParams();
  $: inputParams = Object.keys($model.params).reduce((acc, par) => {
    return staticParams.includes(par)
      ? acc
      : { ...acc, [par]: $model.params[par] };
  }, {});
  $: changeParams = model.changeParams;
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
