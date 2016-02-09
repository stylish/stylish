# Skypager Electron

An Application Runtime for delivering Electron based Applications.

## Workspaces

Skypager Projects can have a file `data/settings/workspaces.yml` and this will
control how electron windows will open for the app.

## Notes

### Generating an HTML Template for electron development

This is a hack to make the different libs available for webpack externals

```javascript
window.React = require('react')
window.ReactDOM = require('react-dom')
window.ReactBootstrap = require('react-bootstrap')
window.Redux = require('redux')
window.ReactRedux = require('react-redux')
window.Router = require('react-router')
window.ReduxActions = require('redux-actions')
window.ReduxThunk = require('redux-thunk')
window.ReduxSimpleRouter = require('redux-simple-router')
window.History = require('history')
```

running this will generate an html file 

```bash
skypager build --entry ./src/externals.js --entry-name externals \
--no-content-hash --platform electron --html-filename template.html
```

now when you run the dev server you can do this.

```bash
skypager dev --html-template-path=public/template.html --external-vendors --skip-theme
```
