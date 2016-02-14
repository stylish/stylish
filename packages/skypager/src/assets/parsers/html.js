import cheerio from 'cheerio'

import { slugify } from '../../util'

export function DomWrapper(content, asset) {
    let dom = cheerio.load(content)

    return {
        get asset() {
            return asset
        },
        get content() {
            return content
        },
        get dom() {
            return dom
        },
        section(title, additional) {
          return dom(`section#${slugify(title)} ${additional}`)
        },
        css(...args) {
          return dom(...args)
        }
    }
}
