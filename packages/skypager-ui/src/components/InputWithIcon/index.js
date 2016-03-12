import React, { PropTypes as types } from 'react'

import Icon from 'ui/components/Icon'

const INPUT_TYPES = [
  'datepicker',
  'search',
  'text'
]

export class InputWithIcon extends React.Component {
  render () {
    let props = this.props
    let { className, type, icon, name } = props

    return (
       <div className={'input-with-icon ' + (className || '')}>
       </div>
    )
  }
}

InputWithIcon.propTypes = {
}

export default InputWithIcon
