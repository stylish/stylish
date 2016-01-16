import React, { Component } from 'react'
import DOM from 'react-dom'
import { Modal, Button, Input, Table } from 'react-bootstrap'

export default class ImportDatasourceModal extends Component {
  constructor(props){
    super(props)

    this.state = {
      showModal: !!props.showModal,
      currentStep: 'chooseType',
      dataSourceType: '',
      sources: [],
      selected: new Set()
    }
  }
  
  close(){
    this.setState({showModal: false})
  }

  open(){
    this.setState({showModal: true})
  }

  next(){
    let blueprint = $getCurrentBlueprint()
    let {currentStep, selected, dataSourceType} = this.state
    
    if(currentStep === 'chooseType'){
      this.beginSelectSources()
    }
    
    if(currentStep === 'selectSources'){
      blueprint.importExternalDatasources({
        type: this.state.dataSourceType,
        selected: this.state.selected.entries()
      }).then(response => {
        console.log("Imported external datasources", response)
        this.close()
      })
    }
  }
  
  beginSelectSources(){
    let {dataSourceType} = this.state
    
    if(dataSourceType === "google_spreadsheet"){
      $services.google.listSpreadsheets().then(response => {
        this.setState({
          currentStep: 'selectSources',
          sources: response.items,
          sourceHeadings: ['Spreadsheet Name']
        })
      }).catch(error => {
        console.log("Error pulling google drive", error) 
      })
    }
  }

  syncState(e){
    let update = {}
    let target = e.target

    update[target.name] = target.value
    this.setState(update)
  }

  displayCurrentStep(){
    let {currentStep} = this.state
    
    if(currentStep === 'chooseType'){ return chooseType.call(this, this.state) } 
    if(currentStep === 'selectSources'){ return selectSources.call(this, this.state) } 
  }
  
  render(){
    const close = this.close.bind(this)
    const next = this.next.bind(this)

    return (
      <Modal show={this.state.showModal} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>Import Datasource</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {this.displayCurrentStep()}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={close}>Cancel</Button>
          <Button onClick={next}>Next</Button>
        </Modal.Footer>
      </Modal>
    )
  }
  
  static inject(){
    DOM.unmountComponentAtNode(document.getElementById('modal-container'))
    DOM.render(<ImportDatasourceModal showModal={true} />, document.getElementById('modal-container'))
  }
}

function chooseType(){
  let syncState = this.syncState.bind(this)

  return (
    <div>
      <Input onChange={syncState} ref="dataSourceType" type="select" name="dataSourceType" label="What type of data source is?">
        <option value="">Select one...</option>
        <option value="google_spreadsheet">Google Drive Spreadsheet</option>
        <option value="other_query">Query Integration Services</option>
      </Input>
    </div>
  )
}

function handleCheckboxSelection(e){
  let target = e.target
  let {selected} = this.state

  if(target.checked){
    selected.add(target.value)
  } else {
    selected.delete(target.value)
  }
  
  this.setState({selected})
}

/* the formatter will is called in the context of the modal view */
let sourceFormatters = {
  google_spreadsheet: function(row, index, parent){
    let {selected} = this.state
    let handleSelection = handleCheckboxSelection.bind(this)
    
    function handlePreviewLinkClick(e){
      e.preventDefault()  
      console.log("Open preview", e.target.href)
    }

    return (
      <tr key={index}>
        <td className="rowSelector">
          <Input onClick={handleSelection} type="checkbox" value={row.id} checked={selected.has(row.id)} />
        </td>
        <td>
          {row.title}
        </td>
        <td>{row.ownerNames.join(' ')}</td>
        <td>
          <a onClick={handlePreviewLinkClick} href={row.alternate_link} >Open</a>
        </td>
      </tr>
    )
  },
  other_query: function(row, index, parent){

  }
}

let sourceHeadings = {
  google_spreadsheet: function(){
    return ['Select','Title','Owned By','Preview']
  }
}

function selectSources(){
  const styles = require('./ImportDatasourceModal.scss')
  
  let formatter = sourceFormatters[this.state.dataSourceType]
  let headingTitles = sourceHeadings[this.state.dataSourceType] ? sourceHeadings[this.state.dataSourceType]() : []
  let body = this.state.sources.map((row,index)=>{
    return formatter.call(this, row, index, this)    
  })

  return (
    <div className={styles.select_sources}>
      <Table striped condensed>
        <thead>
          <tr>
          {headingTitles.map((heading,index) => {
             return(<th key={index}>{heading}</th>)
           })}
          </tr>
        </thead>
        <tbody>
          {body}
        </tbody>
      </Table>
    </div>
  )
}
