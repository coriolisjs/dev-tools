<script>
  import { of } from 'rxjs'
  import { withProjection } from '@coriolis/coriolis-svelte'

  import CommandListItem from './CommandListItem.svelte'

  const commandsList$ = of([{ id: 'Command 1' }])
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
{#each $commandsList$ as commandState (commandState.id)}
  <CommandListItem {...commandState} />
{/each}
</ul>
