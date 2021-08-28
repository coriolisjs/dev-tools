<script>
  import { withProjection } from '@coriolis/coriolis-svelte'

  import { projectionList } from '../../projections/projectionList.js'

  import ProjectionListItem from './ProjectionListItem.svelte'

  const projectionList$ = withProjection(projectionList)
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
{#each $projectionList$ as projectionState (projectionState.id)}
  <ProjectionListItem {...projectionState} />
{/each}
</ul>
