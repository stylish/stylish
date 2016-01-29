import React from 'react'
import { Button } from 'react-bootstrap'
import { Link } from 'react-router'
import IconNavLayout from 'skypager-ui/src/layouts/IconNavLayout'
import Icon from 'skypager-ui/src/components/Icon'
import IconNav from 'skypager-ui/src/components/IconNav'

export class HomePage extends React.Component {
  render () {
    const links = [{
      label: 'Home',
      link: '/',
      icon: 'home'
    }]

    return (
      <IconNavLayout wide brandStyle='success' brandIcon='rocket' links={links}>
        <div className='container'>
          <h1>Home</h1>
          <Link to="login">
            <Button bsSize="large" bsColor="success">Login</Button>
          </Link>
        </div>
      </IconNavLayout>
    )
  }
}

export default HomePage
