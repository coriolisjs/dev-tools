<script>
  // import { of } from 'rxjs'
  import { withProjection } from '@coriolis/coriolis-svelte'

  import TrackingsListItem from './TrackingsListItem.svelte'

  import { trackingsList } from '../../../projections/trackingsList'

  // const trackingsList$ = of([{
  //   id: 'uniqId',
  //   type: 'Tracking event',
  //   payload: {},
  //   meta: {},
  //   error: false,
  // }])
  const trackingsList$ = withProjection(trackingsList)
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
{#each $trackingsList$ as trackingEvent (trackingEvent.id)}
  <TrackingsListItem trackingEvent={trackingEvent} />
{/each}
</ul>
