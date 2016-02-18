import { clone } from '../util'
import { html, renderer } from '../assets/document/renderer'

export function HtmlRenderer (options = {}) {
  let project = options.project = options.project || this

  if (options.asset) {
    return AssetRenderer.apply(project, arguments)
  }

  return ProjectRenderer.apply(project, arguments)
}

export function AssetRenderer (options = {}) {
    let { asset, project, target } = options

    if (asset.assetClass.name !== 'Document') {
        throw('Do not know how to render this type of asset into HTML')
    }

    let ast = clone(asset[target || 'transformed'])

    let rendered

    try {
        rendered = html(asset.transformed, options = {})
    } catch(error) {
        rendered = error.message
    }

    return rendered
}

export function ProjectRenderer (options = {}) {
    let project = options.project = options.project || this
    let payload = project.documents.all.map(asset => AssetRenderer.call(project, Object.assign({}, options, {asset})))

    return Layouts[options.layout || 'none']({
        title: options.title || project.name,
        headScriptsPayload: '',
        stylesPayload: '',
        scriptsPayload: '',
        bodyId: "",
        bodyClass: "",
        rootId: 'root',
        contentPayload: payload.join("\n")
    })
}

export const Layouts = {
    basic,
    none({contentPayload}){
        return contentPayload
    }
}

function basic(options = {}) {
    let { title, rootId, headScriptsPayload, stylesPayload, bodyId, bodyClass, contentPayload, scriptsPayload } = options

    return (`<html>
        <head>
            <title>${ title }</title>
            ${ headScriptsPayload }
            ${ stylesPayload }
        </head>
        <body id="${ bodyId }" class="${ bodyClass }">
            <div id=${ rootId } class="project container">
                ${ contentPayload }
            </div>
            ${ scriptsPayload }
        </body></html>`)
}

export default HtmlRenderer
