# Application Runtimes

Application Runtimes are intended to provide shared react / flux infrastructure for each different type of 
application which can be generated from the Skypager framework.

## Features

### Project Adapter

Skypager provides a few standard project exporters which export the project in a javascript friendly module
which can be used by things like webpack or the react native packager.  The Application Runtime should seamlessly
pull this content in to be used as content or runtime configuration for the code.

- [x] Implement web-adapter
- [] Implement react-native adapter
- [] Implement electron adapter

### Web Application Shell

The Web Application Shell should render any React based entry points we throw at it.

### Native Application Shell

The Native Appplication Shell should render any React based entry points we throw at it. 

### Electron Application Shell

The Electron Appplication Shell should render any React based entry points we throw at it. 
