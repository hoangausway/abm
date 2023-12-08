<script>
  export let asyncModel;

  const title = asyncModel.title;
  let open = false;
</script>

<span on:click={() => (open = !open)}>{title}</span>
<dialog {open}>
  <article>
    <h2>Keller-Segel Model</h2>
    <p>
      A good example of such agent-environment interaction is in the
      Keller-Segel slime mold aggregation model,
      where slime mold cells behave as agents and interact with an environment
      made of cAMP molecules. The concentration of cAMP is defined everywhere in
      the space, and it changes by its own inherent dynamics (natural decay) and
      by the actions of agents (secretion of cAMP molecules by agents).
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
