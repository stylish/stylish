import React from 'react'
import { Button, ButtonGroup, DropdownButton, MenuItem } from 'react-bootstrap'

export class ToggleGroup extends React.Component {
  render () {
    const props = this.props

    return (
      <ButtonGroup bsClass={'btn-group ' + props.className}>

      </ButtonGroup>
    )
  }
}

ToggleGroup.propTypes = {
  className: React.PropTypes.string,
  items: React.PropTypes.array.isRequired,
  onChange: React.PropTypes.func,
  value: React.PropTypes.object.isRequired,
}

export default ToggleGroup
