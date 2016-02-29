# Integrations Plugin

The Integrations plugin provides a unified interface for `Skypager Projects` which wish to include data and functionality from popular third party APIs and services, including:

- Github
- NPM
- Dropbox
- Google Drive
- Amazon Web Services
- Segment
- Slack
- Travis

## Usage

A Project can use the integrations plugin by including the plugin in the `package.json's` `skypager` configuration.

```json

{
  "name": "my-project",
    "skypager":{
    "main": "skypager.js",
    "plugins": ["integrations"]
  }
}
```

This will enable actions in the project to generate the necessary settings and options a project will need to make use of the services it wishes to integrate with.

## Examples

### Referencing Github Issues and Milestones

1) Run the `skypager use:integration github` command.

2) Edit `project/settings/integrations/github.yml`

```yml
development:
  application:
    client_id: 'whatever'
    client_secret: 'whatever_else'

production:
  application:
    client_id: 'env.GITHUB_CLIENT_ID'
    client_secret: 'env.GITHUB_CLIENT_SECRET'
```

This will make the github client available to the project, which will let you incorporate the functionality in various helper scripts such as actions or exporters, and in your data sources.  Making github data available via a datasource will let you use it in your react apps if you wanted to.

Example of a data source:

3) Add a data source file in `project/data/github/issues.js`

```js
module.exports = function(params = {}, context = {}) {
  let project = context.project
  let client = project.clients.github
  
  switch(params.source) {
   case issues:
    return client.issues.promise(params)
   case milestones:
    return client.milestones.promise(params)
  }
}
```

4) Use the github issues data in your react views

```js
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

```

5) Use the github data in your actions

```js
action('update issues')

execute(function(params = {}, context = {}) {
  let { project } = context
  
  // do whatever
})
```

