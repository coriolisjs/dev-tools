<script>
  export let id
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

    h3 {
      padding: 0;
      margin: 0 0 0 -1em;
    }
  }
</style>

<li
  on:click={() => console.log(id)}
>
  <h3>Command {id}</h3>
</li>
