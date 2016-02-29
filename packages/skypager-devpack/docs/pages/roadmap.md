# Roadmap

## Library Bundling

Investigate Webpack DLL Plugin Usage as a way of bundling React, React Router, React Bootstrap, Redux, and all of the other library dependencies so that they can be used but not need to be incorporated into the development step.

## Configuration Surface Area

Reduce the configuration surface area as much as possible while still employing all of the best practices in development, test, and production optimization tooling and techniques.

We need to be careful not to be too constraining, since one size fits all configuration is not useful for projects with multiple developers or multiple environments and platforms.

Through the use of profiles, which combine:

- project (specific customer settings, content, functionality requirements )
- platform (web, electron, native)
- environment (production, development, etc)

