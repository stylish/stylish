import React, { Component, PropTypes as types } from 'react'

import FluidTopNavbar from 'ui/components/FluidTopNavbar'

export class FluidLayout extends Component {
  static displayName = 'FluidLayout';

   static propTypes = {
    branding: types.shape({
      icon: types.string,
      style: types.string,
      brand: types.string
    }),
    children: types.node.isRequired,
    containerClassName: types.string,
    searchForm: types.node,
    navigation: types.shape({
      links: types.arrayOf(types.shape({
        icon: types.string,
        label: types.string,
        link: types.string
      }))
    })
  };

  static defaultProps = {
    searchForm: (<div />),
    branding:{
      icon: 'rocket',
      style: 'default',
      brand: 'Skypager'
    },
    navigation: {
      links:[{
        label: 'Home',
        link: '/',
        icon: 'home'
      }]
    }
  };

  render () {
    const { navigation, branding, searchForm } = this.props

    const { links } = navigation

    return (
      <div className='fluid-layout'>
        <FluidTopNavbar searchForm={searchForm} branding={branding} links={links} />

        <div className='container-fluid container-fluid-spacious'>
            {this.props.children}
        </div>
      </div>
    )
  }
}


export default FluidLayout
