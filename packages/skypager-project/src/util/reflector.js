import assign from 'object-assign'


/*
* Build a more dynamic dot path interface for a registry or collection
* that is capable of rebuilding itself when one of the members
* changes, and only lazy loads the paths that are traversed
*/

function reflector (host, startProp, getIdPaths) {
  invariant(host, 'provide a host')
  invariant(host.type, 'host needs a type')
  invariant(idPaths, 'idPaths should be a function')
  invariant(startProp, 'provide startProp')

  let Interface = class {

  }
}
