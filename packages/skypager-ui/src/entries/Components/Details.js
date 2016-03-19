import React, { Component, PropTypes as type } from 'react'

import stateful from 'ui/util/stateful'

import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'
import Grid from 'react-bootstrap/lib/Grid'

import DataTable from 'components/DataTable'

export class ComponentDetails extends Component {
  static displayName = 'ComponentDetails';

  static propTypes = {};

  get componentData() {
    let { project } = this.context
    let id = this.props.params.splat

    let script = project.scripts.query({id, categoryFolder: 'components'})[0]
    let doc = project.docs[`${ script.id }`]
    let apiDoc = project.data[`${script.id}/interface`]
    let api = (apiDoc && apiDoc.data) || {}

    return {
       doc,
       api,
       ...script,
       description: api.description,
       componentProps: api.props,
       title: api.displayName || doc.documentTitle,
       html: doc.html
    }
  }

  render() {
    let { title, description, componentProps } = this.componentData

    let docColumns = [{
      label: 'Property',
      field: 'key'
    }, {
      label: 'Data Type',
      field: 'value'
    }]

    return (
      <Grid>
        <Row>
          <h2>{title}</h2>
          <p>{ description }</p>
        </Row>
        <hr className='m-b-md' />
        <Row>
          <Col xs={6}>
          <ul>
            { Object.keys(componentProps).map(key => {
              let prop = componentProps[key]

              return (
                <li key={key}>
                  <strong className=''>{key}</strong>
                  <span>{prop && prop.description}</span>
                </li>
              )
            }) }
          </ul>
          </Col>
          <Col xs={6}>
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default stateful(ComponentDetails)
