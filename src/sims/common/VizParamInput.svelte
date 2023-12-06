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
  <span>{key}</span>
  <div>
    <input
      value={params[key]}
      bind:this={elm}
      disabled={isRunning}
    />
    <button on:click|preventDefault={change}>
      {params[key]}
    </button>
  </div>
</div>

<style>
  .changes {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 0.5rem;
    margin-left: 0;
  }
  .changes > span {
    display: block;
    /* margin-right: 6px; */
    font-family: monospace;
    font-size: 0.75rem;
  }
  .changes > div {
    width: 12rem;
    display: flex;
    justify-content: flex-end;
    align-items: center;
  }
  .changes > div > input {
    height: 2rem;
    margin: 0px 6px;
    padding: 8px;
    border: none;
    border-bottom: 1px solid #ccc;
    text-align: right;
    font-family: monospace;
    font-size: 0.75rem;
  }
  .changes > div > button {
    width: 6rem;
    height: 2rem;
    line-height: 0.5;
    font-family: monospace;
    font-size: 0.75rem;
    background-color: var(--pico-secondary);
  }
</style>
