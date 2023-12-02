<script>
  export let params;
  export let key;
  export let changeParams;
  export let isRunning = false;

  let elm;

  const change = () => {
    params[key] = parseFloat(elm.value);
    changeParams({ ...params });
  };
</script>

<div class="changes">
  <div>{key}</div>
  <input value={params[key]} bind:this={elm} disabled={isRunning} />
  <kbd on:click={change}>{params[key]}</kbd>
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
