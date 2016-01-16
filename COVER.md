# Skypager Portfolio Manager

This project contains the documentation and source code for the Skypager family of products.  

Skypager is a portfolio management application.

A Portfolio is any body of work product can be grouped and categorized by projects.  A project is some kind of work product and the author's documentation about that work product.  Our development of this project is of course heavily driven by source code projects for web and mobile applications, but as a design goal are striving to think about the shared patterns and how the things we benefit from as programmers (templating, version control, components, API Integrations, Databases, Build Tools, etc) can be shared with other professionals without also taxing them with the same burden and tooling churn and tomfoolery common in today's software development world.

## Project Structure

This project is itself a `Skypager Project`

### Docs

The `./docs` folder is the most important of all, as it is how we can map out the entire universe of information in the project directly inline with the writing we do about this information in the process of developing, maintaining, and iterating on the entire portfolio.  Skypager takes all of this writing, and the content and structure of this writing, and generates a map of all of the named entities in the project.  

Skypager generates an API for the benefit of external interfaces which might be interested in doing things with these entities, whether including them on a website, or using them to power a report, visualization, or some other application process.

The `documents` in this project are grouped into subfolders:

- `backlogs`: notes about things that we'd like to eventually do
- `concepts`: expository writing about concepts frequently discussed in the project.
- `epics`: a way of grouping features together.
- `notes`: notes about the prject.
- `packages`: the source code projects for skypager packages
- `personas`: information about the different users of the products in this portfolio
- `projects`: the source code projects for skypager projects

### Data

The `./data` folder contains serialized data snapshots that are relevant to the project.  It also contains scripts which are responsible for mapping some external data sources to the project.  Project Documents which share similar path / filenaming conventions can automatically access and reference this data, and even include it when rendering it as an HTML page or React View.

### Models

The `./models` folder contains Model Definititions.  These are how we specify how the raw data that is extracted from the `documents` and `data_sources` gets turned into an `Entity` object.  Models can be trained and configured automatically by the patterns that exist in the writing already.


### Actions

The `./actions` folder contains Action helper definitions [#TODO](Docs).  Actions are commands that can be dispatched to the project itself, or to individual assets and entities within the project.

### Packages

The `./packages` folder contains the actual source code to various npm modules that the portfolio is dependent on.

### Projects

The `./projects` folder also contains source code, but to npm modules that are part of the portfolio itself and generally done on behalf of a client.  Projects can easily be cloned, configured, customized, previewed, and published.
