module.exports = project.data_sources.reduce((memo, ds) => {
    return Object.assign(memo, ds.data)
  }, {})
