const not =
  (fn) =>
  (...args) =>
    !fn(...args)

const is = (obj) => (item) => item === obj

export const createMockedCoriolisStore = (fixtures) => {
  let currentFixtureName
  let currentFixture

  let subscriptions = []

  const setFixture = (fixture, fixtureName) => {
    currentFixtureName = fixtureName
    currentFixture = fixture
    console.log('switches to fixture', fixture, fixtureName)
    subscriptions.forEach((trigger) => trigger())
  }

  const isFixtureName = (name) => name in fixtures

  const getNextFixtureName = () =>
    (currentFixtureName &&
      Object.keys(fixtures).find(
        (_, idx, arr) =>
          arr[idx === 0 ? arr.length - 1 : idx - 1] === currentFixtureName,
      )) ||
    Object.keys(fixtures)[0]

  return {
    fixtureNames: Object.keys(fixtures),
    getCurrentFixtureName: () => currentFixtureName,
    selectFixture: (selectedFixtureName) => {
      if (selectedFixtureName && !isFixtureName(selectedFixtureName)) {
        throw new Error(`Unknown fixture name "${selectedFixtureName}"`)
      }

      const fixtureName = selectedFixtureName || getNextFixtureName()

      setFixture(fixtures[fixtureName], fixtureName)
    },
    setFixture,
    dispatch: (...args) => {
      console.log('dispatch', ...args)
    },
    withProjection: (projectionSetup) => {
      const using = {
        name: projectionSetup.name,
      }
      projectionSetup({
        useState: (state) => {
          using.state = (using.state || []).concat(state)
        },
        useEvent: (...events) => {
          using.event = (using.event || []).concat(
            events.map((event) =>
              typeof event === 'function' ? event.toString() : event,
            ),
          )
        },
        useProjection: (subProj) => {
          using.proj = (using.proj || []).concat(subProj.name)
        },
        useValue: (value) => {
          using.value = (using.value || []).concat(value)
        },
        setName: (name) => {
          using.name = name
        },
      })

      // console.log('with projection', using.name, using)

      return {
        subscribe: (valueCallback) => {
          const trigger = () => {
            if (using.name in currentFixture) {
              console.log(
                `subscription "${using.name}" got value`,
                currentFixture[using.name],
              )
              valueCallback(currentFixture[using.name])
            } else {
              console.log(`subscription "${using.name}" did not get value`)
            }
          }

          Object.defineProperty(trigger, 'name', {
            value: using.name,
            writable: false,
          })

          subscriptions = subscriptions.concat(trigger)

          trigger()

          return () => {
            subscriptions = subscriptions.filter(not(is(trigger)))
            console.log('unsubscribe', using.name)
          }
        },
        getValue: () => {
          console.log('getValue', using.name)
          return currentFixture[using.name]
        },
        get value() {
          console.log('get value', using.name)
          return currentFixture[using.name]
        },
        connect: () => {
          console.log('connected', using.name)

          return () => {
            console.log('disconnected', using.name)
          }
        },
      }
    },
  }
}
