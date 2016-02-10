import React from 'react'
import { Link } from 'react-router'

export function FixedTopNavbar ({ brand, brandLink, links }) {
  return (
    <nav className='navbar navbar-inverse navbar-fixed-top' role='navigation'>
        <div className='container'>
            <div className='navbar-header'>
                <button type='button' className='navbar-toggle' data-toggle='collapse' data-target='#bs-example-navbar-collapse-1'>
                    <span className='sr-only'>Toggle navigation</span>
                    <span className='icon-bar'></span>
                    <span className='icon-bar'></span>
                    <span className='icon-bar'></span>
                </button>
                <a className='navbar-brand' href={brandLink}>{brand}</a>
            </div>
            <div className='collapse navbar-collapse' id='bs-example-navbar-collapse-1'>
                <ul className='nav navbar-nav'>
                  {links.forEach(pair => {
                    return <li>
                            <Link to={pair[0]}>
                              {pair[1]}
                            </Link>
                          </li>
                  })}
                </ul>
            </div>
        </div>
    </nav>
  )
}

FixedTopNavbar.propTypes = {
  brand: React.PropTypes.string
}

export default FixedTopNavbar
