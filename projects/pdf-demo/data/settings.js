function data (datasource) {
  return datasource.project.data.query({ id: /^settings\// }).merge()
}

exports.data = module.exports = data
