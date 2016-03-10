import React, { Component, PropTypes as type } from 'react'
import { render } from 'react-dom'

import SkypagerLogo from '../svg/skypager/logo'

class LaunchPanel extends Component {
  static displayName = 'LaunchPanel';

  static propTypes = {
    height: type.number,
    width: type.number
  };

  static defaultProps = {
    height: 500,
    width: 500
  };

  render() {
    const { height, width } = this.props

    return (
      <div className='container fluid'>
        <div style={{height, width, maxHeight:'100%',maxWidth:'100%'}}>
          <SkypagerLogo />
        </div>
      </div>
    )
  }
}

render(
  <LaunchPanel />,
  document.getElementById('app')
)
