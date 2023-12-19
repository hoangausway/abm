<script>
  // component props
  export let asyncModel;

  $: [nF, nR] = $asyncModel.agents.reduce(
    (acc, ag) => {
      return ag.type === 'f' ? [acc[0] + 1, acc[1]] : [acc[0], acc[1] + 1];
    },
    [0, 0]
  );
</script>

<h4>Foxes: {nF}</h4>
<h4>Rabbits: {nR}</h4>
<h4>Sum: {nF + nR}</h4>
<h4>Foxes/Rabbits: {nR > 0? Number(nF/nR).toFixed(2) : 'N/A'}</h4>
