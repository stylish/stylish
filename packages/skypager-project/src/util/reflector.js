import assign from 'object-assign'


/*
* Build a more dynamic dot path interface for a registry or collection
* that is capable of rebuilding itself when one of the members
* changes, and only lazy loads the paths that are traversed
*/

function reflector (host, startProp, getIdPaths) {
  host.should.be.an.Object()
  host.should.have.property('type')
  idPaths.should.be.a.Function()
  startProp.should.be.a.String()

  let Interface = class {

  }
}
