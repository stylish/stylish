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

3) Add a data source file in `project/data/github_issues.js`

```js
module.exports = function(params = {}, context = {}) {
  //TODO
}
```


