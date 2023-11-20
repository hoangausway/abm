<script>
  export let props;
</script>

<div>
  <svelte:component this={props.route.component} {...props} />
</div>
