import React from 'react'
import { stateful } from 'skypager-application'
import { Grid, Row, Col, Button, Glyphicon, Input} from 'react-bootstrap'

import DashboardHeader from 'skypager-ui/src/components/DashboardHeader' 
import Icon from 'skypager-ui/src/components/Icon'
import { connect } from 'react-redux'
const innerGlyphicon = <Icon icon="magnifying-glass" />;

import { SearchBox, RefinementListFilter, Hits, HitsStats, SearchkitComponent,
    SelectedFilters, MenuFilter,HierarchicalMenuFilter, Pagination, ResetFilters} from "searchkit";




class PropertyHits extends Searchkit.Hits {
  
  renderResult(result:any) {
        let url = "/PropertyDetail" + result._source.id 
        return (
            <tr>
               <td>{result}</td>
               <td></td>
               <td></td>
               <td></td>
            </tr>
        )
    }
  
}







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
    const SearchkitProvider = Searchkit.SearchkitProvider;
    const Searchbox = Searchkit.SearchBox;
    const Hits = Searchkit.Hits;	
  
  	let { searchTerm } = this.state
  	let onSearchChange = this.onSearchChange

  	const sk = new SearchkitManager("https://dori-us-east-1.searchly.com", {
  		basicAuth:"site:4f98bdfb2b2d3f4dc9b9b86c61bcd10f"
	  })

    return (

        <div id="container">
        <SearchkitProvider searchkit={sk}>
        <Grid>
          <Row>
            <Col xs={8}>
                <DashboardHeader title='PDF Management System' subtitle='Search Properties'>
                  <Searchbox searchOnChange={true}  />
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
                  <PropertyHits hitsPerPage={10}/>
                </table>
            </Col>
          </Row>

        </Grid>
        </SearchkitProvider>
     </div>

      
    )
  }

}

export default connect((state) => ({settings: state.settings}))(HomePage)
