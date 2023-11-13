<script>
  import { onMount, onDestroy } from 'svelte';

  // model and data
  export let w = 200;
  export let h = 200;

  export let Viz;
  export let model;

  let data;
  const updateData = () => (data = model);

  // svg update
  let frameId;
  const update = () => {
    updateData();
    frameId = requestAnimationFrame(update);
  };

  onMount(() => update());
  onDestroy(() => frameId && cancelAnimationFrame(frameId));
</script>

{#if data}
  <svelte:component this={Viz} {data} {w} {h} />
{/if}
