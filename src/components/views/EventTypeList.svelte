<script>
  import DevToolsContainer from '../units/DevToolsContainer/index.svelte'
  import EventTypeList from '../units/EventTypeList.svelte'
</script>

<DevToolsContainer>
  <h2 slot="title">Liste des types d'events</h2>
  <EventTypeList />
</DevToolsContainer>
