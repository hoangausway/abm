<script>
  // Simulator
  import model from './model';
  import Viz from './Viz.svelte';

  $: rbs =
    $model &&
    $model.agents.reduce((acc, a) => {
      return a.type === 'r' ? acc + 1 : acc;
    }, 0);
  $: fxs = $model && $model.agents.length - rbs;
  $: rbsPerFxs = fxs > 0 ? (rbs / fxs).toFixed(2) : `${rbs} / NO FOXES`;
</script>

<div class="viz">
  <p>Rbs: {rbs}</p>
  <p>Fxs: {fxs}</p>
  <p>Rbs/Fxs: {rbsPerFxs}</p>
  <Viz {model} />
</div>

<style>
  .viz {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
</style>
