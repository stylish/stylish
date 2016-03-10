import React, { Component, PropTypes as type } from 'react'
import { stateful } from 'ui/applications'
import { Grid, Row, Col } from 'react-bootstrap'

import SiteHeader from 'components/SiteHeader'

export class Documentation extends Component {
  static displayName = 'Documentation';

  static propTypes = {
    copy: type.object,
    content: type.object,
    settings: type.shape({
      icon: type.string,
      brand: type.string
    })
  };

  render() {
    const components = this.props.route.components
    const Sidebar = components.sidebar

    return (
        <Grid>
          <Row>
            <Col xs={12}>
              <SiteHeader icon='rocket' />
            </Col>
          </Row>
          <Row className="inner-column-layout">
            <Col className="column left-column" xs={3} ref='sidebar'>
              <Sidebar />
            </Col>
            <Col className="column right-column" xs={9} ref='content'>
              { this.props.children }
            </Col>
          </Row>
        </Grid>
    )
  }
}

export default stateful(Documentation, 'settings', 'content', 'copy')
