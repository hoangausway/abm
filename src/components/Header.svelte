<script>
  import page from 'page';
  import { toggleMode } from '../stores/themeModes';
  import GearIcon from './GearIcon.svelte';
  import Logo from './Logo.svelte';

  const models = [
    { model: 'schelling', title: 'Schelling' },
    { model: 'kellersegel', title: 'Keller-Segel' },
  ];
  let selected;
  const selectModel = () => {
    page.redirect(`/abm/${selected.model}`);
  };
</script>

<!-- Nav -->
<nav class="container-fluid">
  <ul>
    <li><Logo /></li>
  </ul>
  <ul>
    <li><a href="/">Home</a></li>
    <li>
      <select bind:value={selected} on:change={selectModel}>
        <option disabled>Select Model</option>
        {#each models as model}
          <option value={model}>{model.title}</option>
        {/each}
      </select>
    </li>
    <li><a href="#" on:click|preventDefault={toggleMode}><GearIcon /></a></li>
  </ul>
</nav>

<style>
  nav {
    border-bottom: 2px solid #eee;
    box-shadow: whitesmoke;
  }
</style>
