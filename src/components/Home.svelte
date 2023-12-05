<script>
  const models = [
    { model: 'schelling', title: 'Schelling' },
    { model: 'kellersegel', title: 'Keller-Segel' },
    { model: 'foxrabbit', title: 'Fox Rabbit' },
  ];
</script>

<h1>Home</h1>
<ul role="listbox">
  {#each models as model}
    <li>
      <a href={`/abm/${model.model}`}>
        {model.title}
      </a>
    </li>
  {/each}
</ul>
