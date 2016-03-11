import React, { Component, PropTypes as type } from 'react'

import cx from 'classnames'

const Sizes = [
  'small',
  'medium',
  'large'
]

export function Icon (props = {}) {

  const { icon, size, inverse } = props

  const sizeClass = size ? `icon-${ size }` : `icon-default`

  props.className = cx({
    icon: true,
    [`icon-${ icon }`]: true,
    [sizeClass]: sizeClass,
    inverse
  })

  return (
    <span { ...props } />
  )
}

export default Icon

Icon.Sizes = Sizes

Icon.propTypes = {
  icon: type.string.isRequired,
  size: type.oneOf(Sizes),
  inverse: type.bool
}
