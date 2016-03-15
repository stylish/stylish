import React, { Component, PropTypes as type } from 'react'
import stateful from 'ui/util/stateful'

import FeatureList from 'ui/components/FeatureList'
import DashboardHeader from 'ui/components/DashboardHeader'
import { Link } from 'react-router'

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

  get shells() {
    let { project } = this.context
    let { filters, copy } = this.props

    return project
      .scripts.query({ ...filters, categoryFolder })
      .map(script => {
        let doc = project.docs[`${ script.id }`]

        return {
          icon: doc.data.icon,
          title: doc.title,
          text: doc.mainCopy,
          link: `/application-shells/details/${ doc.id }`
        }
      })
  }

  render() {
    const copy = this.props.copy

    return (
      <FeatureList tileBody={additionalInfo} features={this.shells} />
    )
  }
}

export default stateful(BrowseShells, 'settings', 'shells.filters', 'copy')

function additionalInfo(props = {}, context = {}) {
  return (
    <Link to={props.link} className='btn btn-primary'>
      Details
    </Link>
  )
}
