<script>
  import Abm from '@common/ABM.svelte';
  import Viz from './Viz.svelte';
  import Info from './Info.svelte';

  const modelPath = '/src/sims/models/schelling.js';
  const postStepFn = ({ params, agents, env }) => {
    console.log('postStepFn Schelling model');
  };
</script>

<Abm {modelPath} {Viz} {Info} {postStepFn} />
