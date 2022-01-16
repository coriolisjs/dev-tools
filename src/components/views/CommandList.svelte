<script>
  import CommandList from '../units/CommandList.svelte'
  import DevToolsContainer from '../units/DevToolsContainer/index.svelte'
</script>

<DevToolsContainer>
  <svelte:fragment slot="title">Liste des commandes</svelte:fragment>
  <CommandList />
</DevToolsContainer>
