<script>
  import { LayerCake, Svg } from 'layercake';
  import Scatter from './Scatter.svg.svelte';

  // component props
  export let asyncModel;
  export let width = 400;
  export let height = 400;

  $: data = $asyncModel.agents;
</script>

<!-- The wrapper div needs to have an explicit width and height in CSS.
It can also be a flexbox child or CSS grid element.
The point being it needs dimensions since the <LayerCake> element will
expand to fill it. -->
<div style:width={`${width}px`} style:height="{`${height}`}px">
  <LayerCake
    padding={{ top: 10, right: 10, bottom: 10, left: 10 }}
    xPadding={[10, 10]}
    yPadding={[10, 10]}
    x={'x'}
    y={'y'}
    {data}
  >
    <Svg><Scatter /></Svg>
  </LayerCake>
</div>
