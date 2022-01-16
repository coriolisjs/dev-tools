<script>
  import { withProjection } from '@coriolis/coriolis-svelte'

  import * as componentIndex from './views/componentIndex'
  import DevToolsButton from './units/DevToolsContainer/DevToolsButton.svelte'

  import { enabledViewName } from '../projections/ui/enabledViewName'

  const CurrentView$ = withProjection(enabledViewName)
</script>

{#if $CurrentView$}
  <svelte:component this={componentIndex[$CurrentView$]} />
{:else}
  <DevToolsButton />
{/if}
