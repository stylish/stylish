import React, { Component, PropTypes as type } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { stateful } from 'ui/applications'

export class Main extends Component {
  static displayName = 'Main';

  static provides = 'layout';

  static propTypes = {
    children: type.element,
    components: type.shape({
      sidebar: type.element
    })
  };

  static regions = {
    children: type.element,
    sidebar: type.shape({
      provides: type.enum(['navigation'])
    })
  };

  render() {
    const { sidebar, children } = this.props

    return (
      <Grid layout='documentation'>
        <Row>
          <Col ref='sidebar' xs={3}>
            { sidebar }
          </Col>
          <Col ref='children' xs={9}>
            { children }
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default stateful(Main, 'settings')
