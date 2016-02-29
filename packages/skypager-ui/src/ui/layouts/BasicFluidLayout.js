import React, { Component, PropTypes as types } from 'react'

export class BasicFluidLayout extends Component {
  static displayName = 'BasicFluidLayout';

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
    branding:{
      icon: 'rocket',
      style: 'default',
      brand: 'Skypager'
    }
  };

  render () {
    const { navigation, branding, searchForm } = this.props

    return (
      <div className='fluid-layout'>
        <div className='container-fluid container-fluid-spacious'>
            {this.props.children}
        </div>
      </div>
    )
  }
}


export default BasicFluidLayout
