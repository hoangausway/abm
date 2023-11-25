<script>
  // Simulator
  import SimControls from '../simcontrols/SimControls.svelte';

  $: promise = Promise.all([
    import(/* @vite-ignore */ `./model.js`),
    import(/* @vite-ignore */ `./Viz.svelte`),
    import(/* @vite-ignore */ '../common/VizParams.svelte'),
  ]);
</script>

<!-- svelte-ignore empty-block -->
{#await promise then [modelModul, vizModule, vizPapamsModule]}
  <SimControls model={modelModul.default} />
  <div class="viz">
    <svelte:component this={vizModule.default} />
    <svelte:component this={vizPapamsModule.default} model={modelModul.default} />
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
