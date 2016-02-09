# Skypager Devpack

This library is intended to work as a part of projects built on top of the skypager system.

This is a Wrapper around Babel, ES6, React, React-Router, Webpack, Hot Module Reloading, CDN Deployment, and all of the other things you need to make decisions on and keep up to date with. 

Skypager Devpack bundles common library dependencies and configuration profiles for common development, testing, and production scenarios for different platforms: web, electron desktop apps, and react-native mobile apps.  The goal is to have something which just works inside of any project, without having to rely on boilerplate projects.

Internally it is a smooth layer over the beast of webpack configuration, babel and other pre-compiler tools and the different optimization and production deployment toolchain.  We try to offer a less taxing developer experience through the use of profiles, which automatically set configuration options appropriate for current situation.

Once a Project's build profile and presets are set, they should rarely change, and within reason should be somethign you can share from project to project.

## Usage

### Skypager Project Actions

The Project Action which is available by default to any skypager project will run the compile or development server for the project and automatically set options for the build or development step based on the settings in the project, or the default curated choices.

```
skypager build --help
skypager serve --help
```

### Skypager CLI

Skypager CLI provides the lowest level of access to skypager-devpack via its `devmode:build` and `devmode:serve` commands.

Any option can be toggled on or off set to whatever you desire.  

Skypager CLI needs to have the devMode switch enabled to expose these options.

You can view the help options by running:

```
skypager --help
skypager build --devMode --help
skypager serve --devMode --help
```
