<script>
  // 25/11/2023 HOANG moved responsive into this component
  import smallPoint from '../../stores/breakpoints';

  // Simulator
  import SimControls from './SimControls.svelte';
  import VizParams from '../common/VizParams.svelte';
  import { createModel } from '../common/modelFactory';
  import { createSimStore } from '../common/simStoreFactory';

  export let model;
  export let Viz;

  const asyncModel = createModel(model);
  const sim = createSimStore();

  const handler = (e) => {
    sim.runOrPause(asyncModel);
  };
</script>

<div class={$smallPoint ? 'single' : 'double'}>
  <div>
    <SimControls {sim} {asyncModel} />
    <VizParams {asyncModel} />
  </div>
  <div on:dblclick={handler}>
    <svelte:component this={Viz} {asyncModel} />
  </div>
</div>

<style>
  .double {
    width: 100%;
    display: grid;
    grid-template-columns: 44% 54%;
    gap: 2%;
  }
  .double :nth-child(1) {
    overflow-y: scroll;
    height: 95vh;
  }
  .double :nth-child(2) {
    overflow-y: scroll;
    height: 95vh;
  }
  .single {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }
</style>
