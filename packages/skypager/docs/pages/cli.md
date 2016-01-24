# Command Line Interface

Skypager ships with a CLI that makes working with projects easier.

```bash
# View the CLI Help
skypager --help

# View Help for the develop command
skypager develop --help
```

## Commands

### Available

Lists the available helpers for this project, such as actions, models, or plugins.

```bash
skypager available --help
```

### Build

Builds a website for this project using the `skypager-devpack` webpack bundle.

```bash
skypager build --help
```

### Console

Runs an interactive REPL in the context of this project.  An instance of the project will be available in the `project` variable in your REPL.

```bash
skypager console --help
```

### Create

Create a project asset, or helper.  Useful for creating new documents or new helpers, and better than creating them from scratch.

```bash
skypager create --help
```

### Develop

Run a development server in the context of the project folder.  This will launch a `skypager-devpack` webpack development server which provides 
you with a React application that is capable of rendering your project.

```bash
skypager develop --help
```

### Init

Create a new skypager project.

```bash
skypager init --help
```

### Listen

Run a server process and expose it via a public accessible Web URL.  This process will simply log any POST requests it receives.  Requests which match a desired pattern will be dispatched as Actions for the project.

This is useful for automatically updating the project's content or data in response to events that occur in other systems such as Github, Dropbox, or Google Drive.

```bash
skypager listen --help
```

### Publish

Publishes the website that gets built from `skypager build` to a static website hosting service such as [http://skypager.io](Skypager.io) or AWS S3.

```bash
skypager publish --help
```

### Run

Dispatch the command line args to a project action, or run one of the importer or exporter scripts for the project from the CLI.

```bash
skypager run --help
```

## Advanced Usage

### Adding your own CLI Commands

You can add your own CLI Commands via plugins or via Action Helpers. 

Add the following to your project's `package.json`:

```json
{
  "skypager":{
    "cli": "cli.js"
  }
}
```

this will `require` the `cli.js` script from your project, and pass it an instance of the `commander` program for you to add your commands to.
