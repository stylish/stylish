import React, { Component, PropTypes as types } from 'react'

import FluidTopNavbar from 'ui/components/FluidTopNavbar'

import stateful from 'ui/util/stateful'

export class FluidLayout extends Component {
  static displayName = 'FluidLayout';

   static propTypes = {
    children: types.node.isRequired,
    containerClassName: types.string,
    searchForm: types.node,
    settings: types.shape({
      branding: types.shape({
        icon: types.string,
        style: types.string,
        brand: types.string
      }),

       navigation: types.shape({
        links: types.arrayOf(types.shape({
          icon: types.string,
          label: types.string,
          link: types.string
        }))
      })

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
    const { searchForm } = this.props

    const { branding, navigation } = this.props.settings
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


export default stateful(FluidLayout, 'settings')
