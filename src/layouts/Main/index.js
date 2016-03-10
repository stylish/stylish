import React, { Component, Children, PropTypes as type } from 'react'
import { Grid, Row, Col } from 'react-bootstrap'
import { stateful } from 'ui/applications'

import HTMLSafe from 'ui/components/HTMLSafe'
import SiteHeader from 'ui/components/SiteHeader'

import styles from './styles.less'

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
        { Children.only(this.props.children) }
      </div>
    )
  }
}

export default stateful(Main, 'settings', 'entities.pages', 'entities.outlines')
