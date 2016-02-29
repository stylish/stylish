import path from 'path'
import fs from 'fs'

export function DocumentParserCache (document, method) {
  let buckets = {
    parse: document.asts.parsed,
    transform: document.asts.transformed,
    index: document.asets.indexed
  }

  let folder = document.project.paths.parser_cache
  let cache_path = path.join(folder, document.cacheKey) + '.json'

  let data

  try {
    data = require(path.resolve(cache_path))
    return data[method]
  } catch (e) {
    buckets[method] = document[method].call(document)

    let cachePayload = JSON.stringify(buckets)

    fs.writeFile(path.resolve(cache_path), cachePayload, (err, result) => {
      if (err) { throw (err) }
    })

    return buckets[method]
  }
}
