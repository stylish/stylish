import React, { Children, Component, PropTypes as types } from 'react'

import chunk from 'lodash/chunk'

import Col from 'react-bootstrap/lib/Col'
import _Grid from 'react-bootstrap/lib/Grid'
import Row from 'react-bootstrap/lib/Row'

/**
 * Renders its children as row of grid columns.
 *
 * For multiple rows, expects children which contain children. array of arrays.
 */
export default class Grid extends Component {
  static displayName = 'Grid';

  static propTypes = {
    /** how many columns is this grid */
    columns: types.number.isRequired,

    /** controls the column width, if not evenly spaced */
    columnWidths: types.arrayOf(types.number),

    /** the elements that will be wrapped as a grid */
    children: types.node.isRequired,

    /** set hasRows to true if the children is an array of columns */
    hasRows: types.bool
  };

  render() {
    return (<div />)
  }
}

/** expose access to the bootstrap grid class */
Grid.Grid = _Grid
Grid.Col = Col
Grid.Row = Row
