import React, { PropTypes as types } from 'react'
import { connect } from 'react-redux'

function mapStateToProps (state) {
  return { }
}

export class HomePage extends React.Component {
  static displayName = 'HomePage';

  static propTypes = {
    dispatch: types.func.isRequired
  };

  render () {
    return (
			<div className='home-page'>
				<h1>Hello</h1>
			</div>
    )
  }
}

export default connect(mapStateToProps)(HomePage)
