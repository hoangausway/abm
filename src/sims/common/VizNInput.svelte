<script>
  export let par;
  export let change;
  let elm;
</script>

<div class="changes">
  <input value={par} bind:this={elm} />
  <kbd on:click={() => change(parseInt(elm.value))}>{par}</kbd>
</div>

<style>
  .changes {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .changes > input {
    height: 28px;
    margin-top: 16px;
    margin-right: 6px;
  }
</style>
