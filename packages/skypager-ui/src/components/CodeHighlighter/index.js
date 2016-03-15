import React, { PropTypes as types } from 'react'
import Highlight from 'react-highlight'

/**
 * Displays a Code snippet using Highlight.js
* */
export default function CodeHighlighter(props = {}) {
  const { language, code, theme } = props

  require('!!style!css!highlight.js/styles/' + theme + '.css')

  return (
    <Highlight className={language}>
      {`${ code }`}
    </Highlight>
  )
}

CodeHighlighter.defaultProps = {
  language: 'javascript',
  theme: 'solarized_dark'
}

CodeHighlighter.propTypes = {
  /** the language is the code written in */
  language: types.string.isRequired,
  /** the code you want to highlight */
  code: types.string.isRequired,
  /** the theme to use */
  theme: types.string
}
