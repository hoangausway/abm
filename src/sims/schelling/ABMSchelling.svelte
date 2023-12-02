<script>
  // Simulator
  import SimControls from '../simcontrols/SimControls.svelte';
  import model from './model';
  import VizParams from '../common/VizParams.svelte';
</script>

<!-- svelte-ignore empty-block -->
{#if model}
  <SimControls {model} />
{/if}

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
