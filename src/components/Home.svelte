<script>
  import Sim from '../sims/Sim.svelte';

  // Schelling model
  import VizSchelling from '../sims/schelling/VizSchelling.svelte';
  import modelSchelling from '../sims/schelling/modelSchelling';
</script>

<Sim model={modelSchelling} Viz={VizSchelling} />
