import React from 'react'
import FluidLayout from 'ui/layouts/FluidLayout'
import stateful from 'ui/util/stateful'

export function WebLayout(props = {}, context = {}) {
  const layoutOptions = props.settings.layoutOptions || {}

  return (
    <FluidLayout {...layoutOptions}>
      {props.children}
    </FluidLayout>
  )
}

export default stateful(WebLayout, 'settings', 'copy')
