import cheerio from 'cheerio'
import select from 'cheerio-select'

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
        css(...args) {
          return dom(...args)
        }
    }
}
