<script>
  import Abm from '@common/ABM.svelte';
  import Viz from './Viz.svelte';
  import Info from './Info.svelte';
  import Analysis from './Analysis.svelte';

  const modelPath = '/src/sims/models/foxrabbit.js';
</script>

<Abm {modelPath} {Viz} {Info}>
  <div class="analys" slot="analys" let:asyncModel>
    <Analysis {asyncModel} />
  </div>
</Abm>

<style>
  .analys {
    width: 100%;
    background-color: beige;
  }
</style>
