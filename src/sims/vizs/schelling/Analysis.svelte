<script>
  import { LayerCake, Svg } from 'layercake';
  import Line from './Line.svelte';

  export let asyncModel;
  export let width = 400;
  export let height = 200;

  const neighborhood = (r, ag) => {
    return (nb) =>
      nb !== ag &&
      Math.pow(ag.x - nb.x, 2) + Math.pow(ag.y - nb.y, 2) < Math.pow(r, 2);
  };

  const satisfactionCalculate = ({ params, agents }) => {
    if (!agents || agents.length === 0) {
      return 0;
    }

    const { r, th } = params;
    const nSat = agents.reduce((acc, a) => {
      // get neighborhood
      const neighbors = agents.filter(
        (nb) =>
          nb !== a &&
          Math.pow(a.x - nb.x, 2) + Math.pow(a.y - nb.y, 2) < Math.pow(r, 2)
      );
      if (neighborhood.length === 0) {
        return acc + 1;
      }

      const nbs = neighbors.filter((nb) => nb.type === a.type);
      const q = nbs.length / neighbors.length;
      if (q >= th) {
        return acc + 1;
      }
      return acc;
    }, 0);

    return nSat;
  };

  let count = 0;
  let data = [];

  $: params = $asyncModel.params;
  $: agents = $asyncModel.agents;

  $: nSat = satisfactionCalculate({ params, agents });
  $: satRate = agents.length > 0 ? nSat / agents.length : 0;

  $: data = data.concat([{ x: count++, y: satRate }]);
</script>

<h4>Satisfaction: {satRate.toFixed(2)}%</h4>
<div style:width={`${width}px`} style:height="{`${height}`}px">
  <LayerCake
    padding={{ top: 10, right: 10, bottom: 10, left: 10 }}
    xPadding={[10, 10]}
    yPadding={[10, 10]}
    x={'x'}
    y={'y'}
    {data}
  >
    <Svg><Line /></Svg>
  </LayerCake>
</div>
