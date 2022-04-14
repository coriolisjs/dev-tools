<script>
  import { withProjection, createDispatch } from '@coriolis/coriolis-svelte'

  import { viewList } from '../../../projections/ui/viewList'
  import { isDevtoolsOpen } from '../../../projections/ui/isDevtoolsOpen'
  import { panelWidth } from '../../../projections/ui/panelWidth'
  import { devtoolsClosed, panelWidthChanged } from '../../../events/ui'

  import NavButton from './NavButton.svelte'

  import { subscribeEvent } from '../../../lib/dom/subscribeEvent'
  import { rafThrottle } from '../../../lib/browser/rafThrottle'

  const views$ = withProjection(viewList)
  const panelWidth$ = withProjection(panelWidth)

  const setPanelWidth = createDispatch(panelWidthChanged)

  const grabbingArea = node => {
    const nodeBounding = node.getBoundingClientRect()

    return {
      top: nodeBounding.top,
      left: Math.max(nodeBounding.left - 5, 0),
      right: Math.min(nodeBounding.left + 5, window.innerWidth),
      bottom: nodeBounding.bottom,
    }
  }

  const isInArea = (area, point) =>
    point.clientX > area.left &&
    point.clientX < area.right &&
    point.clientY > area.top &&
    point.clientY < area.bottom

  const withoutDefaultBehavior = callback => event => {
    event.preventDefault()
    return callback(event)
  }

  const resizeToCursor = (from, initialWidth, ranger) => to => {
    const deltaX = to.clientX - from.clientX
    setPanelWidth(ranger(initialWidth - deltaX))
  }

  const calls = (...callbacks) => arg => callbacks.map(callback => callback(arg))

  const ifInArea = getArea => callback => point => isInArea(getArea(), point) && callback(point)

  const createRanger = (min, max) => value => Math.min(Math.max(value, min), max)

  const minWidth = 450
  const maxWidthMargin = 30

  const handleMousedown = node => {
    const ifInGrabbingArea = ifInArea(() => grabbingArea(node))

    return ifInGrabbingArea(withoutDefaultBehavior(from => {
      const initialWidth = node.getBoundingClientRect().width
      const ranger = createRanger(
        minWidth,
        from.clientX + initialWidth - maxWidthMargin,
      )
      const resizeNode = resizeToCursor(from, initialWidth, ranger)

      document.documentElement.style.cursor = 'col-resize'

      const unsubscribeMousemove = subscribeEvent(document, 'mousemove', rafThrottle(resizeNode))
      const unsubscribeMouseup = subscribeEvent(document, 'mouseup', calls(
        resizeNode,
        event => {
          unsubscribeMouseup();
          unsubscribeMousemove();
          document.documentElement.style.cursor = null
        }
      ))
    }))
  }

  const resizeX = node => ({
    destroy: subscribeEvent(node, 'mousedown', handleMousedown(node))
  })
</script>

<style lang="scss">
  .coriolis-dev-tools {
    background: $color-primary-darker;
    bottom: 0;
    box-shadow: 12px 0px 20px 10px black;
    box-sizing: border-box;
    color: $color-primary-lightest;
    display: flex;
    flex-direction: column;
    font-family: Arial, Helvetica, sans-serif;
    font-size: small;
    padding: 3px 0 3px 6px;
    position: fixed;
    right: 0;
    top: 0;
    width: 500px;
    z-index: 1;

    &:before {
      bottom: 0;
      content: '';
      cursor: col-resize;
      left: -5px;
      position: absolute;
      top: 0;
      width: 10px;
    }

    > :global(*) {
      flex: 1;
      overflow: auto;
    }

    header {
      flex: 0 0 auto;
      overflow: hidden;
      z-index: 1;

      .headerTop {
        background: $color-primary-dark;
        margin: -3px 0 0 -6px;
        padding: 1px 10px 0 10px;
      }

      h2 {
        color: $color-primary-lightest;
        font-size: 1.2em;
        margin: 5px 0 0 20px;
        padding: 0;
      }
    }

    nav {
      display: flex;
      margin-bottom: 10px;
      padding-top: 10px;
      white-space: nowrap;

      :global(.coriolis-dev-tools-button-close) {
        bottom: 35px;
        display: block;
        left: -36px;
        position: absolute;
        transform: rotate(-90deg);
      }
    }
  }
</style>

<div
  class="coriolis-dev-tools"
  use:resizeX
  style="width: {$panelWidth$ || 500}px"
>
  <header>
    <div class="headerTop">
      <h2>
        <slot name="title" />
      </h2>
      <nav>
        <NavButton
          view={false}
          projection={isDevtoolsOpen}
          buildEvent={devtoolsClosed}
          class="coriolis-dev-tools-button-close"
          hint='Close Coriolis devtools'
        >
          Close
        </NavButton>

        {#each $views$ as view (view)}
          <NavButton view={view.name} hint={view.longname || view.name}>{view.name}</NavButton>
        {/each}
      </nav>
    </div>
    <slot name="tools" />
  </header>
  <slot />
</div>
