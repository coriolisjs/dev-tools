import { createCustomElement } from '../lib/browser/customElement'
import { ensureFeatures } from '../lib/browser/loadScript'

import { views } from '../components/views'

import { isDevtoolsOpen } from '../projections/ui/isDevtoolsOpen'
import { viewList } from '../projections/ui/viewList'
import { fullEventList } from '../projections/eventList'
import { eventListFilter } from '../projections/ui/eventListFilter'
import { allEventTypeIndex } from '../projections/eventTypeList'
import { currentStoreId } from '../projections/currentStoreId'
import { fullProjectionsIndex } from '../projections/projectionList'
import { storeList } from '../projections/storeList'
import { eventListSelectedItem } from '../projections/ui/eventListSelectedItem'
import { panelWidth } from '../projections/ui/panelWidth'
import { selectedTimingType } from '../projections/ui/selectedTimingType'

import { viewAdded } from '../events/ui'

import { nav } from './nav'

export const createUI = () => ({
  addEffect,
  addSource,
  withProjection,
  dispatch,
}) => {
  withProjection(isDevtoolsOpen).connect()
  withProjection(currentStoreId).connect()
  withProjection(storeList).connect()
  withProjection(viewList).connect()
  withProjection(fullEventList).connect()
  withProjection(eventListFilter).connect()
  withProjection(allEventTypeIndex).connect()
  withProjection(fullProjectionsIndex).connect()
  withProjection(panelWidth).connect()
  withProjection(eventListSelectedItem).connect()
  withProjection(selectedTimingType).connect()

  addSource(views.map(viewAdded))

  addEffect(nav)

  let elementMounted = false

  createCustomElement(
    'coriolis-dev-tools',
    () =>
      class extends HTMLElement {
        connectedCallback() {
          if (elementMounted) {
            // eslint-disable-next-line no-console
            console.warn('Trying to mount Coriolis dev tools twice... useless')
            return
          }
          elementMounted = true

          // eslint-disable-next-line promise/catch-or-return
          ensureFeatures({
            check: ({ default: Entry, setStoreAPI } = {}) =>
              Entry && setStoreAPI && { Entry, setStoreAPI },
            load: () => import('../components/Entry.svelte'),
          }).then(
            ([{ Entry, setStoreAPI }]) => {
              // eslint-disable-next-line promise/always-return
              if (!elementMounted) {
                // element was unmounted while loading dependencies, don't go further
                return
              }

              setStoreAPI({ dispatch, withProjection })

              this.app = new Entry({
                target: this,
              })
            },
            (error) => {
              // eslint-disable-next-line no-console
              console.error(
                'Could not load all dependencies for Coriolis dev tools',
                error,
              )
            },
          )
        }

        disconnectedCallback() {
          elementMounted = false

          if (this.app) {
            this.app.$destroy()
          }
        }
      },
  )
}
