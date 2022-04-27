<script>
  import { createMockedCoriolisStore } from './mockedCoriolisStore'
  import Entry, { setStoreAPI } from '../components/Entry.svelte'

  export let fixtures

  const mockedCoriolisStore = createMockedCoriolisStore(fixtures)
  mockedCoriolisStore.selectFixture(localStorage.getItem('selectedFixture'))

  window.fixtureNames = mockedCoriolisStore.fixtureNames
  window.selectFixture = mockedCoriolisStore.selectFixture

  setStoreAPI({
    dispatch: mockedCoriolisStore.dispatch,
    withProjection: mockedCoriolisStore.withProjection,
  })

  const handleFixtureSelected = (event) => {
    localStorage.setItem('selectedFixture', event.target.value)
    mockedCoriolisStore.selectFixture(event.target.value)
  }
</script>

<select on:change={handleFixtureSelected}>
  {#each mockedCoriolisStore.fixtureNames as fixtureName}
    <option value={fixtureName} selected={mockedCoriolisStore.getCurrentFixtureName() === fixtureName}>{fixtureName}</option>
  {/each}
</select>

<Entry />
