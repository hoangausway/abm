<script>
  import model from './model';
  import simulator from '../simcontrols/simStore';

  // component props
  export let w = 400;
  export let h = 400;

  const radius = 1;

  // typical d3 margin convention
  const margins = { top: 10, right: 10, bottom: 10, left: 10 };
  $: mainWidth = w - margins.right - margins.left;
  $: mainHeight = h - margins.top - margins.bottom;

  // utility functions for translating elements and scaling
  const move = (x, y) => `transform: translate(${x}px, ${y}px`;
  const xAccessor = (d) => d.x;
  const yAccessor = (d) => d.y;

  let arr = [];

  $: env = $model.env;
  $: max = env.reduce((acc, arr) => {
    const arrMax = Math.max(...arr);
    return acc < arrMax ? arrMax : acc;
  }, 0);
  $: console.log('max: ', max);

  $: step = $simulator && $simulator.step;
  $: console.log('step: ', step);
  $: points =
    points === undefined
      ? [{ cx: step, cy: 0 }]
      : points.concat([{ cx: step, cy: Math.exp(max) }]);

  // $: console.log('points', points);
</script>

<p>MAX: {max}</p>
<figure style={`width: ${w}px; height: ${h}px`}>
  <svg viewBox={`0 0 ${w} ${h}`}>
    <g style={move(margins.top, margins.left)}>
      {#each points as { cx, cy }}
        <circle {cx} {cy} r={3} fill={'blue'} />
        <text x={cx} y={mainHeight} fill="red">{cx}</text>
      {/each}
    </g>
  </svg>
</figure>

<style>
  figure {
    box-shadow: 3px 3px lightgray;
    overflow-x: scroll;
  }
</style>
