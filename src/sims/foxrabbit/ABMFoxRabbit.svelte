<script>
  // Simulator
  import SimControls from '../simcontrols/SimControls.svelte';
  import model from './model';
  import Viz from './Viz.svelte';

  $: [rbs, fxs] =
    $model &&
    $model.agents.reduce(
      (acc, a) => {
        return a.type === 'r' ? [acc[0] + 1, acc[1]] : [acc[0], acc[1] + 1];
      },
      [0, 0]
    );
  $: console.log('rbs / fxs: ', rbs, fxs);
</script>

<SimControls {model} />
<div class="viz">
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
