<script>
  import VizNInput from './VizNInput.svelte';
  import VizParamInput from './VizParamInput.svelte';

  export let model;
  $: n = $model.n;
  $: params = $model.params;
  $: w = $model.w;
</script>

<div class="params">
  {#if n}
    <VizNInput title="n" par={n} change={model.changeN} />
  {/if}
  {#if w}
    <VizNInput title="w" par={w} change={model.changeW} />
  {/if}
  {#if params}
    <hr />
    {#each Object.keys(params) as par}
      <VizParamInput {params} key={par} changeParams={model.changeParams} />
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
