<script>
  import auth from '../stores/auth';
</script>

PRIVATE
{#if $auth}
  <p>
    {$auth.userInfo.name} | {$auth.userInfo.email} | {$auth.userInfo.role}
  </p>
{/if}
