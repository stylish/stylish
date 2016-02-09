import { pick, isNumber, isString } from 'lodash'

export function constrain (settings, bounds) {
  return assign( calculateBounds(settings, bounds), {bounds})
}

export default constrain

export function calculateBounds (inputs = {}, bounds) {
  inputs = assign(
    {},
    inputs,
    calculateSizes(inputs, bounds)
  )

  let outputs = assign(inputs, calculatePosition(inputs, bounds))

  return {
    ...outputs,
    x: outputs.left,
    y: outputs.top
  }
}

export function calculateSizes (settings, screen) {
  settings.height = size(settings.height, screen.height, 'height')
  settings.width = size(settings.width, screen.width, 'width')

  return settings
}

export function topPos (v, limit) {
  if(v.top && isString(v.top)){
    v.top = size(v.top, limit, 'top')
  }

  if(v.bottom && isString(v.bottom)){
    v.bottom = size(v.bottom, limit, 'bottom')
  }

  if(v.bottom) {
    v.top = (limit - v.bottom) - v.height
    delete(v.bottom)
  }

  return v.top || 0
}

export function leftPos (v, limit) {
  if (v.left && isString(v.left)) {
    v.left = size(v.left, limit, 'left')
  }

  if (v.right && isString(v.right)) {
    v.right = size(v.right, limit, 'right')
  }

  if(v.right) {
    v.left = (limit- v.right) - v.width
    delete(v.right)
  }

  return v.left || 0
}

export function calculatePosition (settings, screen) {
  settings.top = topPos(settings, screen.height)
  settings.left = leftPos(settings, screen.width)

  return pick(settings, 'top', 'left')
}

export function size (value, limit, m) {
  let result

  if (isString(value) && value.match(/\%/) ) {
    result = value.replace(/\%/,'')
    result = parseInt(result)
    result = (result / 100) * parseInt(limit)
  } else {
     result = parseInt(value)
  }

  return result
}

function applyLayout(layoutName, settings, screen) {

  switch(layoutName) {
    case 'docked-right':
      break;

    case 'centered':
      return {
       centered: true
      }

    default:
      return {
        height: screen.height * 0.8,
        width: screen.width * 0.8,
        centered: true
      }
  }
}

const { assign, keys, values } = Object
