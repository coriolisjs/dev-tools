<script>
  import { withProjection, createDispatch } from '@coriolis/coriolis-svelte'

  import { currentViewName } from '../../../projections/ui/currentViewName'
  import { viewChanged } from '../../../events/ui'

  export let view
  export let projection = currentViewName
  export let buildEvent = viewChanged

  const viewName$ = withProjection(projection)

  const navAction = createDispatch(() => buildEvent(view))
</script>

<style lang="scss">
  .nav-button {
    background: $color-primary-lighter;
    border-color: $color-primary-darker;
    border-radius: 8px 8px 0 0;
    border-style: solid;
    border-width: 1px 1px 0;
    color: $color-primary-darker;
    cursor: pointer;
    margin: 1px 2px 0;
    padding: 4px 8px 0;

    &:hover {
      background: $color-primary-lighter-hover;
    }

    &[disabled] {
      background: $color-primary-darker;
      border-color: $color-primary-lighter;
      border-width: 2px 1px 0;
      color: $color-primary-lighter;
      cursor: default;
      font-weight: bold;
    }

    &.coriolis-dev-tools-button-close {
      font-size: .9em;
    }
  }
</style>

<button
  class="nav-button {$$props.class || ''}"
  on:click={navAction}
  disabled={$viewName$ === view}
>
  <slot />
</button>
