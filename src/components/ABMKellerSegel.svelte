<script>
  // Simulator
  import SimControls from '../sims/simcontrols/SimControls.svelte';

  $: promise = Promise.all([
    import(/* @vite-ignore */ `../sims/kellersegel/model.js`),
    import(/* @vite-ignore */`../sims/kellersegel/Viz.svelte`),
  ]);
</script>

<!-- svelte-ignore empty-block -->
{#await promise then [modelModul, vizModule]}
  <SimControls model={modelModul.default} />
  <div class="viz">
    <svelte:component this={vizModule.default} />
  </div>
{:catch error}
  <p style="color: red">{error.message}</p>
{/await}

<style>
  .viz {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
</style>
