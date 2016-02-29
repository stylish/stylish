export function values (object) {
  return Object.keys(object).map(key => object[key])
}
