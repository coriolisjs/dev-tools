import { mockedCoriolisStore } from './mockedCoriolisStore'
import { fixtures } from './fixtures'
import Entry, { setStoreAPI } from '../components/Entry.svelte'

let currentFixtureName
const isFixtureName = (name) => name in fixtures

const getNextFixtureName = () =>
  (currentFixtureName &&
    Object.keys(fixtures).find(
      (_, idx, arr) =>
        arr[idx === 0 ? arr.length - 1 : idx - 1] === currentFixtureName,
    )) ||
  Object.keys(fixtures)[0]

const switchFixture = (fixtureName) => {
  if (fixtureName && !isFixtureName(fixtureName)) {
    throw new Error('Unknown fixture name')
  }

  currentFixtureName = fixtureName || getNextFixtureName()

  console.log(
    'switches to fixture',
    currentFixtureName,
    fixtures[currentFixtureName],
  )
  mockedCoriolisStore.setFixture(fixtures[currentFixtureName])
}

export const createDemoApp = () => {
  window.fixtureNames = Object.keys(fixtures)
  window.switchFixture = switchFixture
  window.switchFixture()

  setStoreAPI({
    dispatch: mockedCoriolisStore.dispatch,
    withProjection: mockedCoriolisStore.withProjection,
  })

  const app = new Entry({
    target: document.body,
  })

  return app
}
