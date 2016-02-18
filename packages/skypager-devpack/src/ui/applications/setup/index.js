import Application from '../containers/Application'

import IconNavLayout from 'ui/layouts/IconNavLayout'

import SetupApp from 'ui/applications/setup/SetupApp'
import SetupStyles from 'ui/applications/setup/SetupStyles'
import SetupDeployment from 'ui/applications/setup/SetupDeployment'
import SetupHome from 'ui/applications/setup/SetupHome'

const { assign } = Object

export function setup (project) {

  project.settings = assign(
    project.settings || {},
    appSettings
  )

  Application.create({
    setup: true,
    project,
    entryPoints: {
      index: SetupHome,
      app: { component: SetupApp },
      styles: { component: SetupStyles },
      deployment: { component: SetupDeployment }
    }
  })
}

export default setup

export const appSettings = {
  branding:{
    icon: 'flask',
    brand: 'Skypager',
    theme: 'dashboard-dark'
  },
  navigation:{
    links: [{
      link: '/',
      label: 'Setup',
      icon: 'cog'
    },{
      link: '/app',
      label: 'App',
      icon: 'browser'
    },{
      link: '/styles',
      label: 'Style',
      icon: 'colours'
    },{
      link: '/deployment',
      label: 'Deploy',
      icon: 'upload-to-cloud'
    }]
  }
}

