import React, { Component, Children, PropTypes as type } from 'react'

/**
 * Automatically renders an array of elements in an evenly spaced grid
 */
export default class AutoGrid extends Component {
  static displayName = 'AutoGrid';

  static propTypes = {
    /** children will automatically be wrapped in rows and columns */
    children: type.node.isRequired,

    /** how many items per row */
    columns: type.number,

    /** wrap each child in this wrapper component */
    wrapper: type.element
  };

  static defaultProps = {
    columns: 4
  };

  render() {
    return (
      <CardsContainer wrapper={this.props.wrapper} perRow={this.props.columns}>
        {this.props.children}
      </CardsContainer>
    )
  }
}
