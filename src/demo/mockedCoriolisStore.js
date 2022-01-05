let fixture

let subscriptions = []

export const mockedCoriolisStore = {
  setFixture: (newFixture) => {
    fixture = newFixture
    console.log(
      'subscriptions',
      subscriptions.map((trigger) => trigger.name),
    )
    subscriptions.forEach((trigger) => trigger())
  },
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
          if (using.name in fixture) {
            console.log('subscription value', using.name, fixture[using.name])
            valueCallback(fixture[using.name])
          } else {
            console.log('subscription with no value', using.name)
          }
        }

        Object.defineProperty(trigger, 'name', {
          value: using.name,
          writable: false,
        })

        subscriptions = subscriptions.concat(trigger)

        trigger()

        return () => {
          subscriptions = subscriptions.filter(
            (listener) => listener !== trigger,
          )
          console.log('unsubscribe', using.name)
        }
      },
      getValue: () => {
        console.log('getValue', using.name)
        return fixture[using.name]
      },
      get value() {
        console.log('get value', using.name)
        return fixture[using.name]
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
