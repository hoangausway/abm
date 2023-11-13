<script>
  import Header from './components/Header.svelte';
  import Router from './routing/Router.svelte';
  import themeModes from './stores/themeModes';
</script>

<div data-theme={$themeModes}>
  <Header />
  <main class="container">
    <Router />
  </main>
</div>
