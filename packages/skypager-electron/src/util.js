export function hideProperties (obj, ...args) {
  let props = args.length === 2 ? {[args[0]]:args[1]} : args[0]

  keys(props).forEach(prop => {
    let value = props[prop]

    defineProperty(obj, prop, {
      enumerable: false,
      get: function() {
        return typeof value === 'function' ? value.call(obj) : value
      }
    })
  })
}


