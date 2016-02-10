import React, { createElement } from 'react'
import { connect } from 'react-redux'

import cx from 'classnames'
import BodyClassName from 'react-body-classname'

import SlideDrawer from '../../components/SlideDrawer'

import styles from './DrawerManager.css.less'

export const initialState = {
  overlayActive: false,
  rightDrawerActive: false,
  right: {
    component: 'div',
    props: {}
  }
}

function mapStateToProps (state) {
  return {
    drawerManager: state.drawerManager
  }
}

export class DrawerManager extends React.Component {
  static initialState = initialState;
  static reducer = reducer;

  closeRightDrawer () {
    this.props.dispatch(toggleRightDrawer(false))
  }

  // TODO
  // Since the drawer manager is a singleton / root level component
  // the active contents of a drawer need to be passed in differently.
  // not sure i am going about this correctly. Can i stick a component in the Redux state?
  renderRightDrawer () {
    const closeDrawer = this.closeRightDrawer.bind(this)
    const { rightDrawerActive, right } = this.props.drawerManager

    if (rightDrawerActive) {
      return (
        <SlideDrawer ref='right' handleCloseClick={closeDrawer} active={rightDrawerActive} position='right'>
          { React.createElement(right.component, right.props) }
        </SlideDrawer>
      )
    }
  }

  render () {
    const { layout, brand, links, children, settings } = this.props
    const { rightDrawerActive } = this.props.drawerManager
    const bodyClassName = rightDrawerActive ? 'overlay-active' : ''

    // todo: left, right, bottom, etc
    const drawerActive = rightDrawerActive

    const managerClasses = cx({
      [styles.manager]: true,
      drawerActive
    })

    return (
      <BodyClassName className={bodyClassName}>
        <div className={managerClasses}>
          { this.props.children }
          { this.renderRightDrawer() }
          {drawerActive ? <div className={styles.overlay} /> : undefined}
        </div>
      </BodyClassName>
    )
  }
}

DrawerManager.propTypes = {
  children: React.PropTypes.node.isRequired,
  drawerManager: React.PropTypes.object
}

export default connect(mapStateToProps)(DrawerManager)

export const TOGGLE_RIGHT_DRAWER = 'TOGGLE_RIGHT_DRAWER'
export const LOAD_RIGHT_DRAWER = 'LOAD_RIGHT_DRAWER'

export function toggleRightDrawer (active) {

  return {
    type: TOGGLE_RIGHT_DRAWER,
    payload: {
      active
    }
  }
}

export function loadRightDrawer ({ component = 'div', props = {}}) {
  return {
    type: LOAD_RIGHT_DRAWER,
    payload: {
      active: true,
      right: {
        component,
        props
      }
    }
  }
}

export const actions = {
   toggleRightDrawer,
   loadRightDrawer
}

export function reducer (state = initialState, {type, payload} = {}) {
  const { rightDrawerActive, right } = state

  if (type === TOGGLE_RIGHT_DRAWER) {
    return Object.assign({}, state, {
      rightDrawerActive: ((payload.active === true && payload.active !== false) || !rightDrawerActive),
    })
  }

  if (type === LOAD_RIGHT_DRAWER) {
    return Object.assign({}, state, {
      rightDrawerActive: true,
      right: payload.right || state.right
    })
  }

  return state
}
