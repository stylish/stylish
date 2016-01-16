import React, { Component } from 'react'
import DOM from 'react-dom'
import { Modal, Button, Glyphicon, Input, ListGroup, ListGroupItem } from 'react-bootstrap'

export default class ImportAssetsModal extends Component {
  constructor(props){
    super(props)

    this.state = {
      showModal: !!props.showModal,
      currentStep: 'chooseType',
      assetType: '',
      folders: [],
      selected: new Set(),
      filterValue: ''
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
    let {currentStep, selected, assetType} = this.state

    if(currentStep === 'chooseType'){
      this.beginSelectSources()
    }

    if(currentStep === 'selectFolders'){
      $getCurrentBlueprint().importAssetFolders({
        type: this.state.assetType,
        folders: this.state.folders
      }).then(r => this.close())
    }
  }
  
  beginSelectSources(){
    if(this.state.assetType === 'google'){
      this.selectGoogleDriveSources()
    }
  } 

  selectGoogleDriveSources(){
    let {assetType, filterValue} = this.state
    let update = {}
    let filters = {}

    if(filterValue.length > 0){
      filters.title = " contains '" + filterValue + "'"
    }

    if(assetType === "google"){
      $services.google.listFolders({
        filters: filters
      }).then(response => {
        this.setState({
          currentStep: 'selectFolders',
          folders: response.items
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
    if(currentStep === 'selectFolders'){ return selectFolders.call(this, this.state) } 
  }
  
  render(){
    const close = this.close.bind(this)
    const next = this.next.bind(this)

    return (
      <Modal show={this.state.showModal} onHide={close}>
        <Modal.Header closeButton>
          <Modal.Title>Sync Assets</Modal.Title>
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
    DOM.render(<ImportAssetsModal showModal={true} />, document.getElementById('modal-container'))
  }
}

function handleSelection(e){
  e.preventDefault()
  let {selected} = this.state

}

let formatters = {
  google: function(folder, index){
    let selected = this.state.selected
    let active = selected.has(folder.id)
    
    let onClick = function(folderId){
      let view = this

      return function(){
        let active = selected.has(folderId)
        if(active) { selected.delete(folderId) } else { selected.add(folderId) }
        view.setState({selected})
      }      
    }.bind(this)

    return (
      <ListGroupItem active={active} key={index} onClick={onClick(folder.id)} folderId={folder.id}>
        <Glyphicon glyph="folder-close" />
        &nbsp;
        {folder.title}
      </ListGroupItem>
    )
  }
}

function chooseType(){
  let syncState = this.syncState.bind(this)
  
  let base = ["file_system"]
  let options = base.concat($services.assetProviders)
   
  return (
    <div>
      <Input onChange={syncState} ref="assetType" type="select" name="assetType" label="Where are these assets stored?">
        <option value="">Select one...</option>
        {options.map(option => {
          return (<option key={option} value={option}>{$t("asset_sources." + option)}</option>) 
        })}
      </Input>
    </div>
  )
}

function selectFolders(){
  let {folders, filterValue} = this.state 
  let formatter = formatters[this.state.assetType].bind(this)

  let items = folders.sort((a,b) => a.title.localeCompare(b.title) )

  let itemWasSelected = handleSelection.bind(this)

  items = items.map((folder,index) => {
    let listGroupItem = formatter(folder,index, itemWasSelected)
    return listGroupItem
  }) 
  
  let styles = require('./ImportAssetsModal.scss')
  let syncState = this.syncState.bind(this)
  
  let onFilterChange = function (e){
    syncState(e)
    this.beginSelectSources()
  }.bind(this)

  return (
    <div className={styles.folders_list}>
      <Input name="filterValue" ref="filterValue" onChange={onFilterChange} value={filterValue} type="text" placeholder="Filter..." />
      <div className="list-wrapper">
        <ListGroup>
          {items}
        </ListGroup>
      </div>
    </div>
  )
}
