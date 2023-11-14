<script>
  import model from './modelSchelling';
  $: params = $model.params;

  $: n = params && params.n;
  $: r = params && params.r;
  $: th = params && params.th;

  let elmInputN, elmInputR, elmInputTh;
  const changeN = () => {
    params.n = parseInt(elmInputN.value);
    model.changeParams({ ...params });
  };
  const changeR = () => {
    params.r = parseFloat(elmInputR.value);
    model.changeParams({ ...params });
  };
  const changeTh = () => {
    params.th = parseFloat(elmInputTh.value);
    model.changeParams({ ...params });
  };
</script>

{#if params}
  <div class="params">
    <div class="changes">
      <input value={n} bind:this={elmInputN} placeholder="Agent number" />
      <kbd on:click={changeN}>{n}</kbd>
    </div>
    <div class="changes">
      <input
        inputmode="decimal"
        value={r}
        bind:this={elmInputR}
        placeholder="Radius"
      />
      <kbd on:click={changeR}>{r}</kbd>
    </div>
    <div class="changes">
      <input
        inputmode="decimal"
        value={th}
        bind:this={elmInputTh}
        placeholder="Threshold"
      />
      <kbd on:click={changeTh}>{th}</kbd>
    </div>
  </div>
{/if}

<style>
  .params {
    padding: 0.7em;
    display: flex;
    flex-direction: column;
    justify-content:space-between;
    align-items: flex-end;
  }
  .changes {
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
