import { effectAdded } from '../events/tracking/effect'
import { get } from '../lib/object/get'
import { set } from '../lib/object/set'
import { currentStoreId } from './currentStoreId'

let count = 0
const getId = () => ++count

const reduceEffectData = (effectData = {}, event) => {
  if (effectData.effect) {
    return effectData
  }

  return {
    ...effectData,
    id: getId(),
    effect: event.payload.effect,
    name: event.payload.effect.name,
  }
}

const reduceEffectMap = (effectMap = new Map(), event) => {
  const effectData = effectMap.get(event.payload.effect)
  const newEffectData = reduceEffectData(effectData, event)

  if (newEffectData === effectData) {
    return effectMap
  }

  const newEffectMap = new Map(effectMap)
  newEffectMap.set(event.payload.effect, newEffectData)

  return newEffectMap
}

export const fullEffectIndex = ({ useState, useEvent }) => (
  useState({}),
  useEvent(effectAdded),
  (lists, event) =>
    set(
      lists,
      event.payload.storeId,
      reduceEffectMap(lists[event.payload.storeId], event),
    )
)

export const effectList = ({ useProjection }) => (
  useProjection(fullEffectIndex),
  useProjection(currentStoreId),
  (effectIndex, storeId) => get(effectIndex, storeId) || new Map()
)
