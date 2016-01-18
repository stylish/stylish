import React from 'react'
import { Link } from 'react-router'
import { Button } from 'react-bootstrap'

export function Main (props = {}, context = {}) {
  return (
    <Link className='btn btn-large btn-primary' to="/other/section">
      Go Aww Yeah.
    </Link>
  )
}

export default Main
