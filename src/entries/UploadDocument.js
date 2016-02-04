import React, { Component, PropTypes as types } from 'react'

import { Button } from 'react-bootstrap'

export class UploadDocument extends Component {
  render () {
    return (
      <div>
				<h3>Upload Document</h3>
				<hr />
        <form className="form-inline" role="form">
            <div className="form-group">
                <label className="sr-only">Field 2</label>
                <input className="form-control" placeholder="Field 2" />
            </div>
            <button type="submit" className="btn btn-primary">Apply</button>
            <button type="button" className="btn">Reset</button>
        </form>
      </div>
    )
  }
}

export default UploadDocument
