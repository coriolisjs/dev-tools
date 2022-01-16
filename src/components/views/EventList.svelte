<script>
  import EventList from '../units/EventList.svelte'
  import EventListFilter from '../units/EventListFilter.svelte'
  import DevToolsContainer from '../units/DevToolsContainer/index.svelte'
</script>

<DevToolsContainer>
  <svelte:fragment slot="title">Liste des events</svelte:fragment>
  <div slot="tools">
    <EventListFilter />
  </div>
  <EventList />
</DevToolsContainer>
