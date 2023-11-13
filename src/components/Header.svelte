<script>
  import { toggleMode } from '../stores/themeModes';
  import GearIcon from './GearIcon.svelte';
  import Logo from './Logo.svelte';
</script>

<!-- Nav -->
<nav class="container-fluid">
  <ul>
    <li><Logo /></li>
  </ul>
  <ul>
    <li><a href="/">Home</a></li>
    <li><a href="#" on:click|preventDefault={toggleMode}><GearIcon /></a></li>
  </ul>
</nav>

<style>
  nav {
    border-bottom: 2px solid #eee;
    box-shadow:whitesmoke;
  }
</style>
