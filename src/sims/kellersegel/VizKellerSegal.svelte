<script>
  // Simulator
  import model from './model';
  import Viz from './Viz.svelte';
</script>

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
