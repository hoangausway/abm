<!--
  @component
  Generates an SVG scatter plot. This component can also work if the x- or y-scale is ordinal, i.e. it has a `.bandwidth` method. See the [timeplot chart](https://layercake.graphics/example/Timeplot) for an example.
 -->
<script>
  import { getContext } from 'svelte';

  export let r = 5;

  const { data, xGet, yGet } = getContext('LayerCake');
  const fillColor = (d) => (d.type === 0 ? 'red' : 'blue');
</script>

<g class="scatter-group">
  {#each $data as d}
    <circle cx={$xGet(d)} cy={$yGet(d)} {r} fill={fillColor(d)} />
  {/each}
</g>
