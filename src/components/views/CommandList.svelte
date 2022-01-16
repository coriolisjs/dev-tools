<script>
  import CommandList from '../units/CommandList.svelte'
  import DevToolsContainer from '../units/DevToolsContainer/index.svelte'
</script>

<DevToolsContainer>
  <h2 slot="title">Liste des commandes</h2>
  <CommandList />
</DevToolsContainer>
