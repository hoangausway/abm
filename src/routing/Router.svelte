<script>
  import page from 'page';

  import routes, { loginPath } from './routes';
  import Double from './Double.svelte';

  import auth from '../stores/auth';
  import redirectPath from '../stores/redirectPath';

  let props;

  // def: set props, set component
  // reactive: $authed, $media.small
  $: setPropsAndComponent = (path) => (ctx) => {
    const route = routes[path];

    // set 'props' variable to route and/or params
    props =
      ctx.params && Object.keys(ctx.params).length > 0
        ? { route, params: { ...ctx.params } }
        : { route };

    // if private and not authenticated, redirect to login page
    if (route.private && !$auth) {
      // save current pathname to $redirectPath for returning after authentication
      $redirectPath = ctx.pathname;

      // redirect to login page
      page.redirect(loginPath);
      return;
    }

    // 25/11/2023 HOANG moved responsive into Double component codes
    // set 'component' variable, reactive to authed and media
    // component = $smallPoint ? Single : Double;
  };

  // def: routing by setup props and component for specified path
  // reactive to `setPropsAndComponent` function
  $: routing = (path) => page(path, setPropsAndComponent(path));

  // do routing
  // reactive to `routing` function
  $: {
    Object.keys(routes).forEach(routing);
    page.start({ hashbang: true });
  }
</script>

<svelte:component this={Double} {props} />
