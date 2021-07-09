<script>
  import VirtualList from '@sveltejs/svelte-virtual-list';

  import { withProjection } from '@coriolis/coriolis-svelte'

  import { filteredEventList } from '../../projections/filteredEventList'
  import { eventListSelectedItem } from '../../projections/ui/eventListSelectedItem'

  import EventListItem from './EventListItem.svelte'
  import EventDetails from './EventDetails.svelte'

  const eventList$ = withProjection(filteredEventList)
  const eventListSelectedItem$ = withProjection(eventListSelectedItem)
</script>

<style lang="scss">
  .eventList {
    position: relative;
    height: 100%;
    overflow: hidden;

    .empty {
      position: absolute;
      width: 100%;
      top: 45%;
      text-align: center;
    }
  }
</style>

<div class="eventList">
{#if ($eventList$ && $eventList$.length)}
  <VirtualList items={$eventList$} let:item>
    <EventListItem {item} selected={$eventListSelectedItem$ === item} />
  </VirtualList>
{:else}
  <div class="empty">No event to display</div>
{/if}
</div>
{#if $eventListSelectedItem$}
<EventDetails details={$eventListSelectedItem$} />
{/if}
