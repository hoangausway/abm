<script>
  import ABM from '../common/ABM.svelte';
  import Viz from './Viz.svelte';
  import Info from './Info.svelte';
  import model from './model';
</script>

<ABM {model} {Viz} {Info} />
