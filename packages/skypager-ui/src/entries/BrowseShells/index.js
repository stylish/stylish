import React, { Component, PropTypes as type } from 'react'
import stateful from 'ui/util/stateful'

import FeatureList from 'ui/components/FeatureList'

const categoryFolder = 'shells'

export class BrowseShells extends Component {
  static displayName = 'BrowseShells';

  static propTypes = {
    filters: type.shape({
      categoryFolder: type.string
    })
  };

  static defaultProps = {
    filters: { }
  };

  static path = 'shells';

  static childRoutes = {
    ':shellId': 'BrowseShells/Details'
  };

  get shells() {
    let { project } = this.context
    let { filters } = this.props

    return project
      .scripts.query({ ...filters, categoryFolder })
      .map(script => {
        let doc = project.docs[`${ script.id }`]
        let paragraph = doc.ast.children.find(node => node.type === 'paragraph')

        return {
          icon: doc.data && doc.data.icon,
          title: doc.title || script.id.split('/').pop(),
          text: paragraph && paragraph.value
        }
      })
  }

  render() {
    const features = this.shells.map(script => ({
      ...script
    }))

    return (
      <FeatureList features={features} />
    )
  }
}

export default stateful(BrowseShells, 'settings', 'shells.filters')
