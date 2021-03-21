<script context="module">
  import { createStoreAPIProvider } from '@coriolis/coriolis-svelte'

  const {
    setStoreAPI,
    shareStoreAPI,
    whenStoreAPIShared,
  } = createStoreAPIProvider()

  export { setStoreAPI }
</script>
<script>
  import Router from './Router.svelte'

  shareStoreAPI()
</script>

{#await whenStoreAPIShared then ready}
  <Router />
{/await}
