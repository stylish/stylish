import React from 'react'
import { stateful } from 'skypager-application'
import { Grid, Row, Col, Button, Glyphicon, Input} from 'react-bootstrap'

import DashboardHeader from 'skypager-ui/src/components/DashboardHeader' 
import Icon from 'skypager-ui/src/components/Icon'
import { connect } from 'react-redux'
const innerGlyphicon = <Icon icon="magnifying-glass" />;



export class HomePage extends React.Component {
  constructor (props, context) {
  	super(props)

  	this.onSearchChange = this.onSearchChange.bind(this)

  	this.state = { searchTerm: '' }
  }

  onSearchChange (e) {
  	let target = e.target

  	this.setState({
  		[e.name]: e.value
  	})
  }

  render () {
  	let { searchTerm } = this.state
  	let onSearchChange = this.onSearchChange

    return (
       <div id="container">
        <Grid>
        	<Row>
        		<Col xs={8}>
        				<DashboardHeader title='PDF Management System' subtitle='Search Properties'>
				       	  <Input ref="search" name='searchTerm' type="text" value={searchTerm} onChange={onSearchChange} onKeyUp={onSearchChange} placeholder="Search Properties" addonAfter={innerGlyphicon}/>
				       	</DashboardHeader>
        		</Col>
        	</Row>
        	<Row>
        		<Col xs={11}>
        				<table className='table table-condensed'>
				       		<thead>
				       			<tr>
				       				<th>Property Address</th>
				       				<th>Status</th>
				       				<th>Reconciled Value</th>
				       				<th>Actions</th>
				       			</tr>
				       		</thead>
				       		<tbody />
				       	</table>
        		</Col>
        	</Row>

        </Grid>
       	
	   </div>
    )
  }

}

export default connect((state) => ({settings: state.settings}))(HomePage)
