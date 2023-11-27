<script>
  export let title;
  export let par;
  export let change;
  let elm;
</script>

<div class="changes">
  <div>{title}</div>
  <input value={par} bind:this={elm} />
  <kbd on:click={() => change(parseInt(elm.value))}>{par}</kbd>
</div>

<style>
  .changes {
    width: 100%;
    display: grid;
    grid-template-columns: 20% 60% 20%;
    grid-gap: 8px;
    align-items: center;
  }
  .changes > input {
    height: 28px;
    margin-top: 16px;
    margin-right: 6px;
  }
</style>
