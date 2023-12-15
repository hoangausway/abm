<script>
  export let title;

  let open = false;
</script>

<span on:click={() => (open = !open)}>{title}</span>
<dialog {open}>
  <article>
    <h2>Schelling’s Segregation Model</h2>
    <p>
      There is a perfect model for our ABM exercise. It is called
      Schelling’s segregation model, widely known as the very first ABM proposed
      in the early 1970s by Thomas Schelling, the 2005 Nobel Laureate in
      Economics.
    </p>
    <p>
      Schelling created this model in order to provide an explanation for why
      people with different ethnic backgrounds tend to segregate geographically.
      Therefore, this model was developed in the approach which reproduces the
      macro-known by using hypothetical micro-unknowns.
    </p>
    <p>
      The model assumptions Schelling used were the following: Two different
      types of agents are distributed in a finite 2-D space. In each iteration,
      a randomly chosen agent looks around its neighborhood, and if the fraction
      of agents of the same type among its neighbors is below a threshold, it
      jumps to another location randomly chosen in the space.
    </p>
    <p>As you can see, the rule of this model is extremely simple.</p>
    <p>
      The main question Schelling addressed with this model was how high the
      threshold had to be in order for segregation to occur. It may sound
      reasonable to assume that segregation would require highly homophilic
      agents, so the critical threshold might be relatively high, say 80% or so.
      But what Schelling actually showed was that the critical threshold can be
      much lower than one would expect. This means that segregation can occur
      even if people aren’t so homophilic.
    </p>
    <p>
      In the meantime, quite contrary to our intuition, a high level of
      homophily can actually result in a mixed state of the society because
      agents keep moving without reaching a stationary state. We can observe
      these emergent behaviors in simulations. Back in the early 1970s,
      Schelling simulated his model on graph paper using pennies and nickels as
      two types of agents (this was still a perfectly computational
      simulation!). But here, we can loosen the spatial constraints and simulate
      this model in a continuous space.
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
