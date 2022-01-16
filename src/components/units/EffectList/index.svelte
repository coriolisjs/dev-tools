<script>
  import { withProjection } from '@coriolis/coriolis-svelte'

  import EffectListItem from './EffectListItem.svelte'

  import { effectList } from '../../../projections/effectList'

  const effectsList$ = withProjection(effectList)
</script>

<style lang="scss">
  ul.content {
    margin: 0;
    padding: 0;
    list-style: none;
    overflow: auto;
  }
</style>

<ul class="content">
{#each [...$effectsList$.values()] as effectState (effectState.id)}
  <EffectListItem {...effectState} />
{/each}
</ul>
