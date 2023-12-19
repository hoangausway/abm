<script>
  import Abm from '@common/ABM.svelte';
  import Viz from './Viz.svelte';
  import Info from './Info.svelte';
  import Analysis from './Analysis.svelte';

  const modelPath = '/src/sims/models/schelling.js';
  const postStepFn = ({ params, agents, env, diff }) => {
    const { type, oldPos, newPos } = diff;
    if (newPos) {
      console.log(
        `Move type ${type}: (${oldPos.x.toFixed(2)}, ${oldPos.y.toFixed(
          2
        )}) -> (${newPos.x.toFixed(2)}, ${newPos.y.toFixed(2)})`
      );
    }
  };
</script>

<Abm {modelPath} {Viz} {Info} fnPrePostStep={[undefined, postStepFn]}>
  <div class="analys" slot="analys" let:asyncModel>
    <Analysis {asyncModel} />
  </div>
</Abm>

<style>
  .analys {
    width: 100%;
    background-color: beige;
  }
</style>
