import Documentation from './components/Documentation'
import BrowseDocuments from './components/BrowseDocuments'
import ViewDocument from './components/ViewDocument'

import SidebarNav from 'components/SidebarNav'

export const DocumentationEntryPoint = {
  path: 'documentation',

  component: Documentation,

  indexRoute: {
    component: BrowseDocuments,
    components: {
      sidebar: SidebarNav
    }
  },

  components: {
    sidebar: SidebarNav
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
