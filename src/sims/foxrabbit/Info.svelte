<script>
  export let asyncModel;

  const title = asyncModel.title;
  let open = false;
</script>

<span on:click={() => (open = !open)}>{title}</span>
<dialog {open}>
  <article>
    <h2>Foxes & Rabbits Model</h2>
    <p>
      The basic idea of this model is still simple: Rabbit (prey) naturally grow but get
      eaten by foxes (predators), while the foxes grow if they get rabbit but
      otherwise naturally die off.
    </p>
    <p>
      When we are to implement this model as an ABM, these ecological dynamics
      should be described at an individual agent level, not at an aggregated
      population level.
    </p>
    <footer>
      <button class="secondary" on:click={() => (open = !open)}> Close </button>
    </footer>
  </article>
</dialog>

<style>
  span {
    margin-right: 2rem;
    font-weight: bold;
    font-size: 0.8rem;
    cursor: pointer;
  }
</style>
