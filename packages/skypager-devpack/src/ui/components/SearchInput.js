import React from 'react'

import InputWithIcon from './InputWithIcon'

export class SearchInput extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      value: props.value
    }
  }

  handleChange (e) {
    let { target } = e
    let { name, value } = target
    let oldValue = this.state.value

    this.setState({
      [name]: value
    })

    this.props.onChange(value, oldValue)
  }

  render () {
    const handleChange = this.handleChange.bind(this)
    const { value } = this.state

    return <input type='text' />
  }
}

SearchInput.propTypes = {
  value: React.PropTypes.string,
  onChange: React.PropTypes.func
}

export default SearchInput
