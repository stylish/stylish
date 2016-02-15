import stream from 'stream'
import { writeFileSync as writeFile, existsSync as exists, createWriteStream as writeable, createReadStream as readable } from 'fs'
import { resolve, join } from 'path'

export class Streamer {
  constructor (options = {}) {
    this.root = options.root
    this.writers = {}
    this.readers = {}
  }

  read (name) {
    if (this.readers[name]) {
      return this.readers[name]
    }

    let path = join(this.root, `streamer-${name}.log`)

    if (!exists(path)) {
      writeFile(path, '', 'utf8')
    }

    return this.readers[name] = readable(path)
  }

  write (name) {
    if (this.writers[name]) {
      return this.writers[name]
    }

    return this.writers[name] = writeable(
       join(this.root, `streamer-${name}.log`)
    )
  }
}
