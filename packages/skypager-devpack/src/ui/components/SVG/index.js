import { PropTypes as types, createElement } from 'react'

export function SVG (props = {}) {
  return createElement(props.tag || 'svg', {
    className: props.className,
    dangerouslySetInnerHTML: {__html: props.raw}
  })
}

SVG.propTypes = {
  tag: types.string,
  raw: types.string.isRequired
}

export default SVG
