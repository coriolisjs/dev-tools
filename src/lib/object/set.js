const setProp = (obj = {}, prop, value) => {
  if (obj[prop] === value) {
    return obj
  }

  return {
    ...obj,
    [prop]: value,
  }
}

export const set = (obj, key, ...rest) =>
  setProp(obj, key, rest.length > 1 ? set(obj[key], ...rest) : rest[0])
