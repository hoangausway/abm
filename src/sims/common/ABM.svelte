<script>
  // 25/11/2023 HOANG moved responsive into this component
  import smallPoint from '../../stores/breakpoints';

  // Simulator
  import SimControls from './SimControls.svelte';
  import VizParamsSpecial from './VizParamsSpecial.svelte';
  import VizParams from '../common/VizParams.svelte';
  import { createModel } from '../common/modelFactory';
  import { createSimStore } from '../common/simStoreFactory';

  export let model;
  export let Viz;

  const asyncModel = createModel(model);
  const sim = createSimStore();

  const handler = () => sim.runOrPause(asyncModel);
</script>

<main>
  <div class={$smallPoint ? 'single' : 'double'}>
    <div class="container left">
      <SimControls {sim} {asyncModel} />
      <div>
        <div>
          <details>
            <summary role="button" class="secondary"> Special Params </summary>
            <VizParamsSpecial {sim} {asyncModel} />
          </details>
        </div>
        <div>
          <details>
            <summary role="button" class="secondary">Params</summary>
            <VizParams {asyncModel} />
          </details>
        </div>
      </div>
    </div>
    <div class="right" on:dblclick={handler}>
      <svelte:component this={Viz} {asyncModel} />
    </div>
  </div>
</main>

<style>
  .double {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
  }
  .double .left {
    /* overflow-y: scroll; */
    margin-right: 1rem;
  }
  .double .right {
    /* overflow-y: scroll; */
    margin: auto;
    padding: 1rem;
  }
  .single {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
  }

  main {
    width: 100%;
    padding: 1rem;
  }
  details {
    border: 1px solid var(--pico-secondary);
    border-radius: var(--pico-border-radius);
    padding: var(--pico-border-radius);
  }
  details > summary {
    border: none;
  }
</style>
