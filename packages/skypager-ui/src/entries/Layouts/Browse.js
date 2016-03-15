import React, { Component, PropTypes as type } from 'react'
import stateful from 'ui/util/stateful'

import FeatureList from 'ui/components/FeatureList'
import { Link } from 'react-router'

const categoryFolder = 'layouts'

export class BrowseLayouts extends Component {
  static displayName = 'BrowseLayouts';

  static propTypes = {
    filters: type.shape({
      categoryFolder: type.string
    })
  };

  static defaultProps = {
    filters: { }
  };

  get layouts() {
    let { project } = this.context
    let { filters, copy } = this.props

    return project
      .scripts.query({ ...filters, categoryFolder })
      .map(script => {
        let doc = project.docs[`${ script.id }`] || {data:{
          icon: 'browser',
          title: script.id.split('/').pop(),
          text: ''
        }}

        return {
          icon: doc.data.icon,
          title: doc.title,
          text: doc.mainCopy,
          link: `/layouts/details/${ doc.id }`
        }
      })
  }

  render() {
    const copy = this.props.copy

    return (
      <FeatureList tileBody={additionalInfo} features={this.layouts} />
    )
  }
}

export default stateful(BrowseLayouts, 'settings', 'layouts.filters', 'copy')

function additionalInfo(props = {}, context = {}) {
  return (
    <Link to={props.link} className='btn btn-primary'>
      Details
    </Link>
  )
}
