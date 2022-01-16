<script>
  import DevToolsContainer from '../units/DevToolsContainer/index.svelte'
  import ProjectionList from '../units/ProjectionList/index.svelte'
</script>

<DevToolsContainer>
  <svelte:fragment slot="title">Liste des projections</svelte:fragment>
  <ProjectionList />
</DevToolsContainer>
