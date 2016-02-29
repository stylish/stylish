# Link and Path Resolution

We deal heavily with links, URLs, paths to files, etc.  We need the ability to make short hand, or relative references that just work.

Where possible we rely on a convention over configuration approach.  Sometimes a little configuration is required, and sometimes you want to defy convention.

### Project Structure

In general, a project defines a common structure:

- root
  - actions
  - assets
  - data
  - docs
  - src
  - models

### Where should you store different helpers?

Action helpers go in actions, Model helpers go in Models and so on. Doing so will make it possible to automatically discover these components
without manually requiring them in your project.

### Which entity model is responsible for a document?

### What
