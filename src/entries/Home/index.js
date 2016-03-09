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
      <div>
        <HTMLSafe html={pages.cover.html} />
        <Link to="documentation">View the Docs</Link>
      </div>
    )
  }
}

export default stateful(Home, 'settings', 'copy', 'entities.pages')
