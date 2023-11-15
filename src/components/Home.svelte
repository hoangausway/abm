<script>
  import SimControls from '../sims/simcontrols/SimControls.svelte';

  // Schelling model
  import VizSchelling from '../sims/schelling/VizSchelling.svelte';
  import VizParams from '../sims/schelling/VizParams.svelte';
  import model from '../sims/schelling/modelSchelling';
</script>

<SimControls {model} />
<div class='viz'>
  <VizSchelling />
  <VizParams />
</div>

<style>
  .viz {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
  }
</style>