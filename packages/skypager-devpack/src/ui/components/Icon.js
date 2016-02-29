import React from 'react'

export const Icon = (props = {}) => {
  const className = [ props.className || '', 'icon', 'icon-' + props.icon ].join(' ')
  return React.createElement('span', {className})
}

Icon.propTypes = {
  icon: React.PropTypes.string.isRequired,
  className: React.PropTypes.string
}

export default Icon
