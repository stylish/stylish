import React, { Component, PropTypes as types } from 'react'

import Button from 'react-bootstrap/lib/Button'
import ButtonGroup from 'react-bootstrap/lib/ButtonGroup'
import DropdownButton from 'react-bootstrap/lib/DropdownButton'
import MenuItem from 'react-bootstrap/lib/MenuItem'

import Icon from 'ui/components/Icon'

/**
 * The ToggleGroup is a button group with mutiple buttons which can be toggled on or off in any combination.
 */
export class ToggleGroup extends Component {
  static displayName = 'ToggleGroup';

  static propTypes = {
    /** an array of labels for the buttons */
    items: types.arrayOf(
      types.shape({
        label: types.string.isRequired,
        icon: types.string,
        color: types.string,
        style: types.string,
        size: types.string
      })
    ),
    /** an additional onChange handler */
    onChange: types.func
  };

  constructor(props, context) {
     super(props, context)
     this.onChange = props.onChange && props.onChange.bind(this)
  }

  render () {
    const onChange = this.onChange
    const buttons = this.props.items.map(item => {
       return (<Button {...btnProps}>{item.label}</Button>)
    })

    return (
      <ButtonGroup bsClass={`btn-group ${ props.className || '' }`}>
        {buttons}
      </ButtonGroup>
    )
  }
}

export default ToggleGroup
