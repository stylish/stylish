module.exports = require('skypager-project')

import React, { Component, PropTypes as type } from 'react'
import { stateful } from 'ui/applications'

export class IssuesBrowser extends Component {
  static displayName = 'IssuesBrowser';

  static propTypes = {
    settings: types.shape({
      github: types.object({
        clientId: types.string.isRequired
      })
    }),

    content: types.shape({
      data: types.shape({
        github: types.shape({
          issues: types.arrayOf(
            types.shape({
              urls: types.object,
              body: types.string,
              number: types.number,
              labels: types.array
            })
          )
        })
      })
    })
  };

  render() {
    let { content } = this.props
    let issues = content.data.github.issues

    return (
      <GithubIssuesLister issues={issues} />
    )
  }
}

export default stateful(IssuesBrowser, 'settings', 'content')
