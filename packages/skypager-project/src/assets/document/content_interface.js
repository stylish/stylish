import { assign, lazy, hide, underscore } from '../../util'

/**
 * In the Model Definition DSL it is possible to define the structure
 * of the document and supply functions which can be used to shape
 * the document into a JSON object.
 *
 */
module.exports = function (document) {
	  let Interface = { }
	  let definition = document.modelClass && document.modelClass.definition

    let ast = document.indexed

    ast.children.forEach(node => {
      if (node.type === 'heading') {
        assign(node, {
          extract: ((...args) => extractContent(node, ...args))
        })
      }
    })

	  Object.keys(definition.sectionsConfig).forEach(sectionId => {
		  let sectionConfig = definition.sectionsConfig[sectionId]

		  if (sectionConfig.builder && sectionConfig.builderType === 'builder') {
			  lazy(Interface, sectionId, (() => {
				  let section = document.nodes.at.id(sectionConfig.slug)
				  let built = sectionConfig.builder(section) || {}

				  if (!isEmpty(sectionConfig.config.articles)) {
					  Object.keys(sectionConfig.config.articles).forEach(articleId => {
						  let articleConfig = sectionConfig.config.articles[articleId]

						  if (articleConfig.builder && articleConfig.builderType === 'map') {
							  lazy(built, articleId, (() => {
								  return section && section.childHeadings.map(articleConfig.builder)
							  }), false)
						}
					})
				}

				  return built
			}), false)
		}
	})

  Interface.toJSON = () => {
    let obj = {}

	  Object.keys(definition.sectionsConfig).forEach(sectionId => {
      obj[sectionId] = {}

		  let sectionConfig = definition.sectionsConfig[sectionId]
	    let section = document.nodes.at.id(sectionConfig.slug)

		  if (sectionConfig.builder && sectionConfig.builderType === 'builder') {
        if (!isEmpty(sectionConfig.config.articles)) {
          Object.keys(sectionConfig.config.articles).forEach(articleId => {
            let articleConfig = sectionConfig.config.articles[articleId]
            if (articleConfig.builder && articleConfig.builderType === 'map') {
              obj[sectionId][articleId] = obj[sectionId][articleId] || section && section.childHeadings.map(articleConfig.builder)
            }
          })
        }
      }
    })

    return obj
  }

  return Interface
}

function extractContent (node, extractionType, options ={}) {
  if (extractionType === 'paragraphs') {
    return 'TODO!'
  }
}

function isEmpty (obj) {
	  return !obj || Object.keys(obj).length === 0
}
