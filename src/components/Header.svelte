<script>
  import page from 'page';
  import { toggleMode } from '../stores/themeModes';
  import GearIcon from './GearIcon.svelte';
  import Logo from './Logo.svelte';

  const models = [
    { model: 'schelling', title: 'Schelling' },
    { model: 'kellersegel', title: 'Keller-Segel' },
    { model: 'foxrabbit', title: 'Fox Rabbit' },
  ];
</script>

<!-- Nav -->
<nav class="container-fluid">
  <ul>
    <li><Logo /></li>
  </ul>
  <ul>
    <li><a href="/">Home</a></li>
    <li>
      <details class='dropdown'>
        <summary aria-haspopup="listbox" role="button" class="secondary">
          Model
        </summary>
        <ul role="listbox">
          {#each models as model}
            <li>
              <a href={`/abm/${model.model}`}>
                {model.title}
              </a>
            </li>
          {/each}
        </ul>
      </details>
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
