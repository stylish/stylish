import React from 'react'

export class SidebarSearchForm extends React.Component {
  constructor (props = {}) {
    super(props)

    this.state = {
      searchTerm: ''
    }
  }

  handleChange (e) {
    let { target } = e

    this.setState({
      [target.name]: target.value
    })
  }

  performSearch (e) {

  }

  render () {
    const handleChange = this.handleChange.bind(this)
    const performSearch = this.performSearch.bind(this)

    const { searchTerm } = this.state

    return <form onSubmit={(e) => e.preventDefault() } className='sidebar-form'>
      <input className='form-control' value={searchTerm} onChange={handleChange} type='text' placeholder='Search...' />
      <button onClick={performSearch} type='submit' className='btn-link'>
        <span className='icon icon-magnifying-glass'></span>
      </button>
    </form>
  }
}
