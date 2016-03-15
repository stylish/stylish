import React, { Component, PropTypes as type } from 'react'
import stateful from 'ui/util/stateful'

import { Link } from 'react-router'

import DashboardHeader from 'components/DashboardHeader'
import DataTable from 'components/DataTable'

const categoryFolder = 'components'

export class BrowseComponents extends Component {
  static displayName = 'BrowseComponents';

  static propTypes = {
    filters: type.shape({
      categoryFolder: type.string
    })
  };

  static defaultProps = {
    filters: { }
  };

  get components() {
    let { project } = this.context
    let { filters, copy } = this.props

    return project.scripts.query({ ...filters, categoryFolder })
  }

  get componentRecords() {
    let docs = this.context.project.content.documents
    let data = this.context.project.content.data_sources

    return this.components
      .map((component) => {
        let api = data[`${component.id}/interface`]
        let doc = docs[`${component.id}`]

        component.docs = doc || {}
        component.api = (api && api.data) || {}

        return component
      })
      .map((component,index) => ({
        ...component,
        index,
        title: component.docs.title || component.id.split('/').pop(),
        description: component.api.description || component.docs.mainCopy || (' '),
        link: (<Link to={`/components/details/${ component.id }` }>View</Link>)
      }))
  }

  render() {
    const copy = this.props.copy

    return (
      <DataTable columns={columns} records={this.componentRecords} />
    )
  }
}

export default stateful(BrowseComponents, 'settings', 'components.filters', 'copy')

const columns = [{
  label: 'Title',
  field: 'title'
},{
  label: 'Description',
  field: 'description'
},{
  label: ' ',
  field: 'link'
}]
