import React, { Children, PropTypes as types } from 'react'

export function DashboardHeader (props = {}) {
    const { title, subtitle, children } = props

    return (
      <div className='dashhead'>
        <div className='dashhead-titles'>
          <h6 className='dashhead-subtitle'>{subtitle}</h6>
          <h2 className='dashhead-title'>{title}</h2>
        </div>

        <div className='dashhead-toolbar'>
          {children}
        </div>
      </div>
    )
}

DashboardHeader.propTypes = {
  subtitle: types.string,
  title: types.string,
  children: types.node
}

DashboardHeader.divider = function(key) {
  return <span key={key} className='dashhead-toolbar-divider hidden-xs' />
}

export default DashboardHeader
