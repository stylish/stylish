import React, { Component, PropTypes as types } from 'react'

import { Grid, Row, Col, Button } from 'react-bootstrap'


import Dropzone from 'react-dropzone'

export class UploadDocument extends Component {
  render () {
    return (
      <div id="container">
				<h3>Select the files to upload.</h3>
				<hr />
        <form className="form-inline" role="form">
          <Grid>
            <Row>
              <Col xs={3}>
                <Dropzone onDrop={this.onDrop}>
                  <div>Drop or select file to upload.</div>
                </Dropzone>
              </Col>
              <Col xs={3}>
                <Dropzone onDrop={this.onDrop}>
                  <div>Drop or select file to upload.</div>
                </Dropzone>
              </Col>
              
              
            </Row>
          </Grid>
          
        </form>
      </div>
    )
  }
}

export default UploadDocument
