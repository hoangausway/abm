<script>
  export let props;
  $: params = props.params;
  $: route = props.route;
</script>

<div>
  {#if params}
    <svelte:component this={route.component} {params} />
  {:else}
    <svelte:component this={route.component} />
  {/if}
</div>
