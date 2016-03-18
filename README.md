# Skypager

This is the portfolio project for Skypager.  A Portfolio is
a parent repository which contains multiple sub projects,
some of which which support or depend on one another.  All
of the projects will share dependencies and tooling by
virtue of the project's folder structure, and through shared
approaches.

## Getting Started

```
git clone git@github.com:architects/skypager-central.git
cd skypager-central
npm install
```

Once this project is cloned and the dependencies are
installed, you should be able to run `npm run test` and see
that the entire test suite runs for each package in the
portfolio.

## Skypager CLI

The `skypager` cli should be installed globally
automatically when you run npm install inside this project.

You can run `skypager --help` to see the available options.

Here are the important commands:

- `skypager dev` will start a webpack development server.
- `skypager build` will run a production webpack build.
- `skypager author` will open up skypager-electron

## Webpack & React Devserver

You can checkout `packages/skypager-template-project` to see
what the default skypager project will look like.

```
cd packages/skypager-template-project
skypager dev
```

The dev server will be running on http://localhost:3000

## Skypager UI Docs

The `skypager-ui` package contains shared UI components,
Page Layouts, and Application Shells.  You can view the docs
project by:

```
cd packages/skypager-ui
skypager dev web
```

It will be running on localhost at the configured port (3000
by default)

