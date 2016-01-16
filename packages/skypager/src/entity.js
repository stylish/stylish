export class Entity {
  constructor(source, options = {}){
    this.id = source.id
    this.uri = source.uri
    
    if (source.AssetClass.groupName === 'documents') {

    }

    if (source.AssetClass.groupName === 'data_sources') {

    }
  }
}

export default Entity
