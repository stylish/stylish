# Plugins

## Specifications 

### Skypager provides some plugins by default 

Skypager includes optional plugins that make it easy to integrate with services like Dropbox, Github, and Google Drive. 

```javascript
project.plugins.available.should.containEql('dropbox','google-drive','github')
```

### Files within the projects plugins folder are loaded automatically 

Projects can easily include their own specific plugins.  This is useful when you have a lot of the same types of projects but don't want to go through the hassle of packaging up your plugin using npm.

```
project.plugins.available.should.containEql('test_runner')
```
