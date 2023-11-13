<script>
  import Icon from './Icon.svelte';
  import iconPaths from './icon-paths';
</script>

<Icon {...$$props} ariaLabel="menu" paths={iconPaths['accordionMenu']} />
