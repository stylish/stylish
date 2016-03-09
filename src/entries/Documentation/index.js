import Documentation from './components/Documentation'
import BrowseDocuments from './components/BrowseDocuments'
import ViewDocument from './components/ViewDocument'

export const DocumentationEntryPoint = {
  path: 'documentation',

  component: Documentation,

  indexRoute: {
    component: BrowseDocuments
  },

  childRoutes:[{
    path: 'browse/:section',
    component: BrowseDocuments
  },{
    path: 'view/:documentId',
    component: ViewDocument
  }]
}

export default DocumentationEntryPoint
