<script>
  export let trackingEvent
</script>

<style lang="scss">
  li {
    padding: .5em .5em .5em 1.5em;

    &:nth-child(even) {
      background: rgba(black, .2);
    }

    &:hover {
      background: rgba(white, .1);
    }
  }
</style>

<li
  on:click={() => console.log(trackingEvent)}
>
  {trackingEvent.type}
</li>
