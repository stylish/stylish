import React, { Component, PropTypes as type } from 'react'
import classnames from 'classnames'

export class FeatureList extends Component {
  static displayName = 'FeatureList';

  static propTypes = {
    features: type.arrayOf(type.shape({
      icon: type.string.isRequired,
      iconSize: type.oneOf(['small','medium','large','huge']),
      title: type.string.isRequired,
      text: type.string.isRequired
    })).isRequired
  };

  render() {
    return (
      <div />
    )
  }
}

export default FeatureList
