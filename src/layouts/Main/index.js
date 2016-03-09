import React, { Component, Children, PropTypes as type } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { stateful } from 'ui/applications'

import HTMLSafe from 'ui/components/HTMLSafe'
import SiteHeader from 'components/SiteHeader'

import styles from 'styles/main.less'

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
    return (
      <div className={styles.main}>
        <SiteHeader />
        <div className={styles.inner}>
          {this.props.sidebar ? this.renderWithSidebar() : this.renderWithoutSidebar()}
        </div>
      </div>
    )
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
