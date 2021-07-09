<script>
  export let type
  export let count
</script>

<style lang="scss">
  li {
    padding: .5em;
    background: rgba(black, .1);

    &:nth-child(even) {
      background: rgba(black, .2);
    }

    &:hover {
      background: rgba(white, .1);
    }

    .count {
      float: right;
      margin-right: 30px;
    }
  }
</style>

<li>
  {type}
  <span class="count">{count}</span>
</li>
