import { pluralize, singularize, clone } from '../../util'

function transformer(ast, doc) {
	let nodes = ast.children

	let mainNode = {
		type: 'unknown',
		children: [ ],
		id: doc.slug,
		data: {
			htmlName: 'main',
			htmlAttributes:{ id: doc.slug, 'class': 'skypager-document ' + (doc.groupName || '') }
		}
	}

	let depthIndexes = doc.indexes.depths
	let present = Object.keys(depthIndexes).filter(d => d >=2 && depthIndexes[d].length > 0).sort()

	let containers = {
		[doc.slug] : mainNode
	}

	present.forEach(level => {
		let headingIndexes = depthIndexes[level]

		headingIndexes.forEach(hIndex => {
			try {
				var heading = doc.nodes.at.index(hIndex)
				nodes[hIndex] = containers[heading.id] = makeContainerNode(heading)
			} catch (error) {
				console.log('error building container node', error.message, doc.paths.absolute)
			}
		})
	})

	nodes.forEach(node => {
		let parentContainer = containers[node.parentId] || mainNode

		if(!node.data) { node.data = {} }
		if(!node.data.htmlAttributes) { node.data.htmlAttributes = {} }

		Object.assign(node.data.htmlAttributes, {
			'data-node-index': node.index
		})

		if(parentContainer){
			parentContainer.children.push(node)
		} else {
		}
	})

	return {
		type: 'root',
		children: [mainNode]
	}
}

const CONTAINERS = {
    2: 'section',
    3: 'article',
    4: 'div',
    5: 'div',
    6: 'div'
}

function makeContainerNode (heading) {
    let htmlName = CONTAINERS[ heading.depth ]

    let htmlAttributes = {
        'class': ['depth-' + heading.depth],
        'id': heading.id
    }

	if(heading.depth === 2 || heading.depth === 3){
		htmlAttributes.class.push(htmlName + 's')
	}

	htmlAttributes.class = htmlAttributes.class.join(' ')

	let rangeInfo = {}
	let descendants = heading.descendants || []

    return Object.assign({}, heading, {
        children:[ heading ],
        data: {
		  htmlName,
		  htmlAttributes
		},
        type: htmlName || 'unknown'
    })
}

module.exports = transformer
