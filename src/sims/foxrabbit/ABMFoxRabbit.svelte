<script>
  import VizParams from '../common/VizParams.svelte';

  // Simulator
  import SimControls from '../simcontrols/SimControls.svelte';
  import model from './model';
</script>

<SimControls {model} />
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
