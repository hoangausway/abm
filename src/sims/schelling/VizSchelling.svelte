<script>
  import { extent, scaleLinear } from 'd3';

  // component props
  export let data;
  export let w;
  export let h;

  const margins = { top: 10, right: 10, bottom: 10, left: 10 }; // typical d3 margin convention
  $: mainWidth = w - margins.right - margins.left;
  $: mainHeight = h - margins.top - margins.bottom;

  // utility functions for translating elements and scaling
  const move = (x, y) => `transform: translate(${x}px, ${y}px`;
  const xAccessor = (d) => d.x;
  const yAccessor = (d) => d.y;
  const fillColor = (type) => (type === 0 ? 'red' : 'blue');

  $: agents = data.agents;

  $: xScale = scaleLinear()
    .domain(extent(agents, xAccessor))
    .range([0, mainWidth]);

  $: yScale = scaleLinear()
    .domain(extent(agents, yAccessor))
    .range([mainHeight, 0]);
</script>

<div class="viz">
  <figure style={`width: ${w}px; height: ${h}px`}>
    <svg viewBox={`0 0 ${w} ${h}`}>
      <g style={move(margins.top, margins.left)}>
        {#each agents as { type, x, y }}
          <circle cx={xScale(x)} cy={yScale(y)} r={3} fill={fillColor(type)} />
        {/each}
      </g>
    </svg>
  </figure>
  <div class='grid'>
    <span>Agents: {data.params.n}</span>
    <span>Radius: {data.params.r}</span>
    <span>Threshold: {data.params.th}</span>
  </div>
</div>

<style>
  .viz {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  figure {
    background-color: whitesmoke;
  }
</style>
