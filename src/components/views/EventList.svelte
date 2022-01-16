<script>
  import EventList from '../units/EventList.svelte'
  import EventListFilter from '../units/EventListFilter.svelte'
  import DevToolsContainer from '../units/DevToolsContainer/index.svelte'
</script>

<DevToolsContainer>
  <h2 slot="title">Liste des events</h2>
  <div slot="tools">
    <EventListFilter />
  </div>
  <EventList />
</DevToolsContainer>
