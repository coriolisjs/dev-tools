<script>
  import EventList from '../units/EventList/index.svelte'
  import EventListFilter from '../units/EventList/EventListFilter.svelte'
  import DevToolsContainer from '../units/DevToolsContainer/index.svelte'
</script>

<DevToolsContainer>
  <svelte:fragment slot="title">Liste des events</svelte:fragment>
  <div slot="tools">
    <EventListFilter />
  </div>
  <EventList />
</DevToolsContainer>
