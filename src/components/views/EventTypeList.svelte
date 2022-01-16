<script>
  import DevToolsContainer from '../units/DevToolsContainer/index.svelte'
  import EventTypeList from '../units/EventTypeList.svelte'
</script>

<DevToolsContainer>
  <svelte:fragment slot="title">Liste des types d'events</svelte:fragment>
  <EventTypeList />
</DevToolsContainer>
