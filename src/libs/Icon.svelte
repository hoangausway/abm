<script>
  export let width = '100%';
  export let height = width;
  export let color = 'currentColor';
  export let viewBox = '0 0 16 16';
  export let ariaLabel = void 0;
  export let ariaHidden = void 0;
  export let title = void 0;
  export let desc = void 0;

  let className = void 0;
  export { className as class };

  export let paths = [];
</script>

<svg
  {viewBox}
  {width}
  {height}
  class={className}
  aria-label={ariaLabel}
  aria-hidden={ariaHidden}
>
  {#if desc}<desc>{desc}</desc>{/if}
  {#if title}<title>{title}</title>{/if}
  {#each paths as d}
    <path {d} fill={color} />
  {/each}
</svg>

<!-- 
  d="M5 5H7V11H5V5M10 5H8V11H10V5M5 19H7V13H5V19M10 13H8V19H10V17H15V15H10V13M2 21H4V3H2V21M20 3V7H13V5H11V11H13V9H20V15H18V13H16V19H18V17H20V21H22V3H20Z"
 -->
