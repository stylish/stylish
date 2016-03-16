import React, { Component, PropTypes as type } from 'react'
import BodyClassName from 'react-body-classname'
import { Link } from 'react-router'
import get from 'lodash/get'

import stateful from 'ui/util/stateful'

import Block from 'components/Block'
import CodeHighlighter from 'components/CodeHighlighter'
import FeatureList from 'components/FeatureList'
import SkypagerLogo from 'components/SkypagerLogo'

import style from 'entries/Home/style.less'

export class Home extends Component {
  static displayName = 'Home';

  static route = {
    hideNav: true
  };

  static propTypes = {
    copy: type.shape({
      home: type.object.isRequired
    })
  };

  render() {
    const { hero, features } = get(this.props, 'copy.home')

    return (
      <BodyClassName className='iconav-hidden'>
        <div>
          help
       </div>
      </BodyClassName>
    )
  }
}

export default stateful(Home, 'copy')

const install = `
npm install skypager-cli -g
skypager init my-portfolio --portfolio
cd my-portfolio && npm install
skypager serve
`.trim()

const code = `
import WebApp from 'skypager-ui/shells/WebApp'
import bundle from 'skypager-ui/bundle/loader'

/**
* The WebApp shell generates a React.Router application consisting
* of whatever screens are in your project. Redux is automatically configured
* to manage your application state.
*/
WebApp.create({ bundle })
`.trim()

