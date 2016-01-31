import React from 'react'

export function MainLayout (props, context) {
  let { children } = props

  return (
     <div className='layout main-layout'>
      { children }
     </div>
  )
}

export default MainLayout
