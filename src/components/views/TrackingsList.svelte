<script>
  import TrackingsList from '../units/TrackingsList/index.svelte'
  import DevToolsContainer from '../units/DevToolsContainer/index.svelte'
</script>

<DevToolsContainer>
  <svelte:fragment slot="title">Liste des commandes</svelte:fragment>
  <TrackingsList />
</DevToolsContainer>
