<script>
  import { extent, scaleLinear } from 'd3';

  // component props
  export let asyncModel;

  export let w = 400;
  export let h = 400;
  export let c0 = 'red';
  export let c1 = 'blue';

  const radius = 3;

  // typical d3 margin convention
  const margins = { top: 10, right: 10, bottom: 10, left: 10 };
  $: mainWidth = w - margins.right - margins.left;
  $: mainHeight = h - margins.top - margins.bottom;

  // utility functions for translating elements and scaling
  const move = (x, y) => `transform: translate(${x}px, ${y}px`;
  const xAccessor = (d) => d.x;
  const yAccessor = (d) => d.y;
  const fillColor = (type) => (type === 0 ? c0 : c1);

  $: agents = $asyncModel.agents;

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
          <circle
            cx={xScale(x)}
            cy={yScale(y)}
            r={radius}
            fill={fillColor(type)}
          />
        {/each}
      </g>
    </svg>
  </figure>
</div>

<style>
  .viz {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  figure {
    background-color: whitesmoke;
    box-shadow: 3px 3px lightgray;
  }
</style>
