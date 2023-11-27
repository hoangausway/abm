<script>
  // Simulator
  import SimControls from '../simcontrols/SimControls.svelte';
  import model from './model';
  import Viz from './Viz.svelte';
  import VizParams from '../common/VizParams.svelte';
</script>

<!-- svelte-ignore empty-block -->
{#if model}
  <SimControls {model} />
  <div class="viz">
    <div class="viz">
      <Viz {model} />
      <VizParams {model} />
    </div>
  </div>
{/if}

<style>
  .viz {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
</style>
