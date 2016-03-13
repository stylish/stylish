import React, { Component, PropTypes as type } from 'react'
import cx from 'classnames'

import Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'
import Col from 'react-bootstrap/lib/Col'

import chunk from 'lodash/chunk'
import times from 'lodash/times'

/**
 * The FeatureList displays content tiles that consist of
 * a large icon, a title, and short paragraphs. Perfect for describing
 * a list of features or highlights.
 */
export class FeatureList extends Component {
  static displayName = 'FeatureList';

  static propTypes = {
    /** use a border around the icons */
    bordered: type.bool,

    /** how many columns to display? two or three */
    columns: type.number,

    /** a spacing class to apply to each feature tile */
    spacer: type.string,

    /** an array of objects which will be rendered as tiles */
    features: type.arrayOf(type.shape({
      /** the icon which represents a feature */
      icon: type.string.isRequired,
      /** A short descriptive title for this feature */
      title: type.string.isRequired,
      /** a brief summary of the feature and why it matters */
      text: type.string.isRequired
    })).isRequired
  };

  static defaultProps = {
    columns: 2,
    bordered: true,
    spacer: 'm-b-md'
  };

  /** Returns <ul> lists containing feature tiles */
  get lists() {
    const { bordered, columns, features, spacer } = this.props

    const classes = cx({
      'featured-list': true,
      'featured-list-bordered': bordered
    })

    let groups = chunk(features, columns)

    return times(columns)
      .map(i =>
        <ul key={i} className={classes}>
          {groups.map((items,pos) => <FeatureTile item={items[i]} key={pos} pos={pos} spacer={spacer} />)}
        </ul>
      )
  }

  render() {
    let { columns } = this.props
    let xs = 12 / columns
    let md = 12 / columns

    return (
      <Grid>
        <Row>
        { this.lists.map((list, key) => {
          return (
            <Col key={key} xs={xs} md={md}>
              {list}
            </Col>
          )
        })}
        </Row>
      </Grid>
    )
  }
}

export default FeatureList

function FeatureTile({pos, spacer, item}) {
  return (
    <li key={pos} className={spacer}>
      <div className='featured-list-icon'>
        <span className={`icon icon-${ item.icon }`} />
      </div>
      <h3>{item.title}</h3>
      <p>{item.text}</p>
    </li>
  )
}
