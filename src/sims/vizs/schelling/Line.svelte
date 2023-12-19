<script>
  import { getContext } from 'svelte';

  const { data, xGet, yGet, zGet } = getContext('LayerCake');

</script>

<g class="line-group">
  {#each $data as d}
  <circle cx={$xGet(d)} cy={$yGet(d)} r={1} fill='red' />
  {/each}
</g>
