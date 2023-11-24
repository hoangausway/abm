<script>
  // 25/11/2023 HOANG moved responsive into this component
  import smallPoint from '../stores/breakpoints';

  export let props;
  $: route = props.route;
  $: left = route.left || route.component;
  $: right = route.right;
</script>

<!-- logic per if right component specified -->
{#if right}
  <!-- logic per if there is params and/or the params for left or right component -->
  <div class={$smallPoint ? 'single' : 'double'}>
    <div><svelte:component this={left} {...props} /></div>
    <div><svelte:component this={right} {...props} /></div>
  </div>
{:else}
  <svelte:component this={left} {...props} />
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
