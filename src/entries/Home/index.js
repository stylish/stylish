import React, { Component, PropTypes as type } from 'react'
import { stateful } from 'ui/applications'

import { Link } from 'react-router'

import HTMLSafe from 'ui/components/HTMLSafe'
import Icon from 'ui/components/Icon'

export class Home extends Component {
  static displayName = 'Home';

  static propTypes = {
    pages: type.shape({
      cover: type.object
    }),
    settings: type.shape({
      branding: type.shape({
        icon: type.string,
        brand: type.string
      })
    })
  };

  render() {
    const { pages, settings } = this.props
    const { branding } = settings
    const { icon, brand } = branding

    return (
      <div className='block text-center block-inverse'>
        <h1 className='block-title'>{ brand }</h1>
        <h4 className='text-muted'>What up?</h4>
        <Link to='documentation' className='btn btn-primary m-t'>View the Docs</Link>
      </div>
    )
  }
}

export default stateful(Home, 'settings', 'copy', 'entities.pages')
