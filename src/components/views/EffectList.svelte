<script>
  import EffectList from '../units/EffectList/index.svelte'
  import DevToolsContainer from '../units/DevToolsContainer/index.svelte'
</script>

<DevToolsContainer>
  <svelte:fragment slot="title">Liste des effets</svelte:fragment>
  <EffectList />
</DevToolsContainer>
