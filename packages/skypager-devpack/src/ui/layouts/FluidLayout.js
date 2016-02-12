import React from 'react'

import FluidTopNavbar from '../components/FluidTopNavbar'

export class FluidLayout extends React.Component {
  render () {
    return (
      <div className='fluid-layout'>
        <FluidTopNavbar children={this.props.navbarItems} />

        <div className='container-fluid container-fluid-spacious'>
            {this.props.children}
        </div>
      </div>
    )
  }
}

FluidLayout.propTypes = {
  children: React.PropTypes.array,
  navbarItems: React.PropTypes.array
}

export default FluidLayout
