import React from 'react'
import { IndexRoute, Route } from 'react-router'

import * as Pages from 'ui/pages'

export function router (pages = []) {

  const routes = pages.map((page,index) => {
    let scope = Pages[page.scope || page.name]
    return <Route key={index} path={page.path} component={scope[page.component]} />
  })

  return (
    <Route path='/'>
      <IndexRoute component={Pages.Home.HomePage} />
      {routes}
    </Route>
  )
}

export default router
