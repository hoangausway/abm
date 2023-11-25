<script>
  // Simulator
  import SimControls from '../sims/simcontrols/SimControls.svelte';

  $: promise = Promise.all([
    import(/* @vite-ignore */'../sims/schelling/model.js'),
    import(/* @vite-ignore */'../sims/schelling/Viz.svelte'),
    import(/* @vite-ignore */'../sims/schelling/VizParams.svelte'),
  ]);
</script>

<!-- svelte-ignore empty-block -->
{#await promise then [modelModul, vizModule, vizPapamsModule]}
  <SimControls model={modelModul.default} />
  <div class="viz">
    <svelte:component this={vizModule.default} />
    <svelte:component this={vizPapamsModule.default} />
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
