import React, { Component, Children, PropTypes as type } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { stateful } from 'ui/applications'

import HTMLSafe from 'ui/components/HTMLSafe'

export class Main extends Component {
  static displayName = 'Main';

  static provides = 'layout';

  static propTypes = {
    children: type.element.isRequired,
    components: type.shape({
      sidebar: type.element
    })
  };

  static regions = {
    children: type.element,
    sidebar: type.shape({
      provides: type.oneOf(['navigation'])
    })
  };

  render () {
    return this.props.sidebar ? this.renderWithSidebar() : this.renderWithoutSidebar()
  }

  renderWithoutSidebar() {
    const { children } = this.props

    return (
      Children.only(children)
    )
  }

  renderWithSidebar() {
    const { sidebar, children, outlines, pages } = this.props

    return (
      <Grid>
        <Row>
          <Col ref='sidebar' xs={3}>
            {sidebar}
          </Col>
          <Col ref='children' xs={9}>
            { children }
          </Col>
        </Row>
      </Grid>
    )
  }
}

export default stateful(Main, 'settings', 'entities.pages', 'entities.outlines')
