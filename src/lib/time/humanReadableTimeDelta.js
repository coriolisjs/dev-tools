export const humanReadableTimeDelta = (delta) => {
  if (delta < 1e3) {
    return `${delta} ms`
  }

  if (delta < 60e3) {
    return `${Math.floor(delta / 100) / 10} s`
  }

  if (delta < 3600e3) {
    return `${Math.floor(delta / 60000)} min`
  }

  if (delta < 86400e3) {
    return `${Math.floor(delta / 3600e3)} h`
  }

  return `${Math.floor(delta / 86400e3)} d`
}
