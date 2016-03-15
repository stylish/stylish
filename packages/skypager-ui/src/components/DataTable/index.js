import React, { Component, PropTypes as type } from 'react'
import get from 'lodash/get'

export class DataTable extends Component {
  static displayName = 'DataTable';

  static propTypes = {
    /** column configuration */
    columns: type.arrayOf(
      type.shape({
        label: type.string.isRequired,
        field: type.string.isRequired,
        width: type.number
      })
    ).isRequired,

    /** an array of records to be put in the columns */
    records: type.array.isRequired
  };

  get tableColumns() {
    return this.props.columns
      .map(({label, width}, key) => <th key={key}>{ label }</th>)
  }

  get tableRows() {
    return this.props.records
      .map((record, index) => <tr key={index} index={index}>{ buildRow(record, this.props.columns) }</tr>)
  }

  render() {
    return (
      <div className='table-full'>
        <div className='table-responsive'>
          <table className='table'>
            <thead>
              <tr>{this.tableColumns}</tr>
            </thead>
            <tbody>
              {this.tableRows}
            </tbody>
          </table>
        </div>
      </div>
    )
  }
}

export default DataTable

function buildRow (record, columns) {
  return columns.map(
    (column, columnIndex) => <td key={columnIndex} columnIndex={columnIndex}>{ buildColumn(record, column, columnIndex)}</td>
  )
}

function buildColumn(record, columnConfig) {
  console.log('record', record, columnConfig)
  return <div>{ get(record, columnConfig.field) }</div>
}
