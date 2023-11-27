<script>
  // Simulator
  import model from './model';
  import VizParams from '../common/VizParams.svelte';

  $: rbs =
    $model &&
    $model.agents.reduce((acc, a) => {
      return a.type === 'r' ? acc + 1 : acc;
    }, 0);
  $: fxs = $model && $model.agents.length - rbs;
  $: console.log('rbs / fxs: ', rbs, fxs);
</script>

<div class="viz">
  <VizParams {model} />
</div>

<style>
  .viz {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
</style>
