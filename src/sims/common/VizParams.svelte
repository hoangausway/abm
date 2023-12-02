<script>
  import VizParamInput from './VizParamInput.svelte';

  export let model;
  $: params = $model.params;
  $: changeParams = model.changeParams;
</script>

<div class="params">
  {#if params}
    <hr />
    {#each Object.keys(params) as par}
      <VizParamInput {params} key={par} {changeParams} />
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
