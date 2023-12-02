<script>
  // Simulator
  import SimControls from '../simcontrols/SimControls.svelte';
  import model from './model';
  import Viz from './Viz.svelte';
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
