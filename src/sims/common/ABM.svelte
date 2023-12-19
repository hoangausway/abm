<script>
  import { onMount } from 'svelte';

  // 25/11/2023 HOANG moved responsive into this component
  import smallPoint from '../../stores/breakpoints';

  // Simulator
  import SimControls from './SimControls.svelte';
  import VizParamsSpecial from './VizParamsSpecial.svelte';
  import VizParams from './VizParams.svelte';
  import createAsyncModel from './createAsyncModel';
  import { createSimStore } from './createSimEngine';

  export let modelPath;
  export let Viz;
  export let Info;
  export let fnPrePostStep = undefined;

  let asyncModel;

  const sim = createSimStore();

  const handler = () => sim.runOrPause(asyncModel);

  onMount(async () => {
    asyncModel = await createAsyncModel(modelPath, fnPrePostStep);
  });
</script>

<main>
  {#if asyncModel}
    <div class={$smallPoint ? 'single' : 'double'}>
      <div class="container left">
        <SimControls {sim} {asyncModel} {Info} />
        <details>
          <summary role="button" class="secondary"> Special Params </summary>
          <VizParamsSpecial {sim} {asyncModel} />
        </details>
        <details>
          <summary role="button" class="secondary">Params</summary>
          <VizParams {asyncModel} />
        </details>
      </div>
      <div class="right" on:dblclick={handler}>
        <svelte:component this={Viz} {asyncModel} />
        {#if $$slots.analys}
          <slot name="analys" {asyncModel} />
        {/if}
      </div>
    </div>
  {/if}
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
</style>
