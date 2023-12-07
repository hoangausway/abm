<script>
  import { extent, scaleLinear } from 'd3';

  // component props
  export let asyncModel;

  export let w = 400;
  export let h = 400;

  const radius = 3;

  // typical d3 margin convention
  const margins = { top: 10, right: 10, bottom: 10, left: 10 };
  $: mainWidth = w - margins.right - margins.left;
  $: mainHeight = h - margins.top - margins.bottom;

  // utility functions for translating elements and scaling
  const move = (x, y) => `transform: translate(${x}px, ${y}px`;
  const xAccessor = (d) => d.x;
  const yAccessor = (d) => d.y;

  $: agents = $asyncModel.agents;
  $: env = $asyncModel.env;
  $: size = $asyncModel.params.w;
  $: max = env.reduce((acc, arr) => {
    const arrMax = Math.max(...arr);
    return acc < arrMax ? arrMax : acc;
  }, 0);
  $: opacity = (env, x, y) =>
    max > 0 ? env[x][y] * Math.exp(env[x][y] - max) : 0;

  $: N = size && Array.from({ length: size }, (_, index) => index);

  $: xScale = scaleLinear()
    .domain(extent(agents, xAccessor))
    .range([0, mainWidth]);

  $: yScale = scaleLinear()
    .domain(extent(agents, yAccessor))
    .range([mainHeight, 0]);

  $: wScale = w / size;
</script>

{#if env}
  <div class="viz">
    <figure style={`width: ${w}px; height: ${h}px`}>
      <svg viewBox={`0 0 ${w} ${h}`}>
        <defs>
          <radialGradient id="g1" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
            <stop stop-color="#black" offset="0%" />
            <stop stop-color="white" offset="100%" />
          </radialGradient>
        </defs>

        <g style={move(margins.top, margins.left)}>
          {#each N as x}
            {#each N as y}
              <circle
                cx={wScale * x}
                cy={wScale * y}
                r={2 * wScale}
                style="fill: url(#g1);"
                fill-opacity={opacity(env, x, y)}
              />
            {/each}
          {/each}
        </g>
        <g style={move(margins.top, margins.left)}>
          {#each agents as { x, y }}
            <circle cy={xScale(x)} cx={yScale(y)} r={radius} fill={'blue'} />
          {/each}
        </g>
      </svg>
    </figure>
  </div>
{/if}

<style>
  .viz {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  figure {
    background-color: white;
    box-shadow: 5px 5px lightgray;
    border: 1px solid gray;
  }
</style>
