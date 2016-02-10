import { PropTypes as types, createElement } from 'react'

export function HTMLSafe ({ html = '', tag = 'div', className='html-wrapper' }){
  return createElement(tag || 'div', {
    className,
    dangerouslySetInnerHTML: {__html: html}
  })
}

HTMLSafe.propTypes = {
  tag: types.string,
  html: types.string.isRequired
}

export default HTMLSafe
