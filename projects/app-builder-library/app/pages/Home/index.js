import React from 'react'

import { connect } from 'react-redux'

import HomePage from './HomePage'

const mapStateToProps = (state) => ({ })

module.exports = {
  HomePage: connect(mapStateToProps)(HomePage)
}
