<script>
  // Simulator
  import SimControls from '../sims/simcontrols/SimControls.svelte';

  $: console.log($$props);

  $: modelName = $$props.route.model;
  $: vizName = $$props.route.viz;
  $: vizParamsName = $$props.route.vizParams;

  $: promise = Promise.all([
    import(`../sims/schelling/${modelName}.js`),
    import(`../sims/schelling/${vizName}.svelte`),
    import(`../sims/schelling/${vizParamsName}.svelte`),
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
