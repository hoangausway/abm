<script>
  // 25/11/2023 HOANG moved responsive into this component
  import smallPoint from '../stores/breakpoints';

  export let props;
  $: route = props.route;
  $: left = route.left || route.component;
  $: right = route.right;
  $: params = props.params;
  $: paramsForLeft = params && route.component.name === left && left.name;
</script>

<!-- logic per if right component specified -->
{#if right}
  <!-- To do:  logic if there is params and/or the params for left OR right component -->
  <div class={$smallPoint ? 'single' : 'double'}>
    {#if paramsForLeft}
      <div><svelte:component this={left} {...params} /></div>
      <div><svelte:component this={right} /></div>
    {:else}
      <div><svelte:component this={left} /></div>
      <div><svelte:component this={right} {...params} /></div>
    {/if}
  </div>
{:else}
  <svelte:component this={left} {...params} />
{/if}

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
