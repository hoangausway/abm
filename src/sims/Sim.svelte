<script>
  import SimControls from './SimControls.svelte';
  import SimViz from './SimViz.svelte';

  export let model;
  export let Viz;
</script>

<SimControls {model} />
<SimViz {model} {Viz} />
