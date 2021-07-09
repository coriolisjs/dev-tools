<script>
  import CommandList from '../units/CommandList.svelte'
  import DevToolsContainer from '../units/DevToolsContainer.svelte'
</script>

<DevToolsContainer>
  <h2 slot="title">Liste des commandes</h2>
  <CommandList />
</DevToolsContainer>
