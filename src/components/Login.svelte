<script>
  import page from 'page';

  import redirectPath from '../stores/redirectPath';
  import auth from '../stores/auth';

  let email, password;

  const submit = () => {
    auth
      .login({ email, password, location })
      .then((userInfo) => {
        console.log(userInfo);
        page.redirect($redirectPath);
      })
      .catch(console.log);
  };
</script>

<article class="grid">
  <div>
    <hgroup>
      <h1>Sign in</h1>
      <h2>Enter email, password and location to login</h2>
    </hgroup>
    <form on:submit|preventDefault={submit}>
      <input
        type="text"
        name="email"
        placeholder="Email"
        aria-label="Email"
        autocomplete="email"
        bind:value={email}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        aria-label="Password"
        autocomplete="current-password"
        bind:value={password}
        required
      />
      <button type="submit" class="contrast">Login</button>
    </form>
  </div>
  <div />
</article>
