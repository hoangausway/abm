<script>
  // Simulator
  import SimControls from '../simcontrols/SimControls.svelte';
  import model from './model';

  $: rbs =
    $model &&
    $model.agents.reduce((acc, a) => {
      return a.type === 'r' ? acc + 1 : acc;
    }, 0);
  $: fxs = $model && $model.agents.length - rbs;
  $: console.log('rbs / fxs: ', rbs, fxs);

  $: promise = Promise.all([
    // import(/* @vite-ignore */ './model.js'),
    import(/* @vite-ignore */ './Viz.svelte'),
    import(/* @vite-ignore */ '../common/VizParams.svelte'),
  ]);
</script>

<!-- svelte-ignore empty-block -->
{#await promise then [vizModule, vizPapamsModule]}
  <SimControls {model} />
  <h4>{rbs} / {fxs}</h4>
  <div class="viz">
    <svelte:component this={vizModule.default} />
    <svelte:component this={vizPapamsModule.default} {model} />
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
