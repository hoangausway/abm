<script>
  export let props;
  $: params = props.params;
  $: route = props.route;
  $: left = route.left || route.component;
  $: right = route.right;
  $: paramsForLeft = params && route.component.name === left && left.name;
</script>

<!-- logic per if right component specified -->
{#if right}
  <!-- logic per if there is params and/or the params for left or right component -->
  <div class="double">
    {#if !params}
      <div><svelte:component this={left} /></div>
      <div><svelte:component this={right} /></div>
    {:else if paramsForLeft}
      <div><svelte:component this={left} {params} /></div>
      <div><svelte:component this={right} /></div>
    {:else}
      <div><svelte:component this={left} /></div>
      <div><svelte:component this={right} {params} /></div>
    {/if}
  </div>
{:else if paramsForLeft}
  <svelte:component this={left} {params} />
{:else}
  <svelte:component this={left} />
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
</style>
