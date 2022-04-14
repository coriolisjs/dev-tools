<script>
  import { isDevtoolsOpen } from '../../../projections/ui/isDevtoolsOpen'
  import { devtoolsOpened } from '../../../events/ui'

  import NavButton from './NavButton.svelte'
</script>

<style lang="scss">
  // Adds "button" on selector to ensure this selector is more important than initial NavButton styles
  :global(button.nav-button.coriolis-dev-tools-button-open) {
    border-color: $color-primary-lightest;
    border-radius: 90% 10%;
    border-style: outset;
    border-width: 2px;
    bottom: 24px;
    box-shadow: inset -3px -4px 10px -8px rgba(0,0,0,0.5);
    font-size: .8em;
    height: 40px;
    margin: 0;
    overflow: hidden;
    padding: 1px 4px;
    position: fixed;
    right: 48px;
    width: 130px;
  }
</style>

<NavButton
  class="coriolis-dev-tools-button-open"
  view={true}
  projection={isDevtoolsOpen}
  buildEvent={devtoolsOpened}
>
  Coriolis dev tools
</NavButton>
