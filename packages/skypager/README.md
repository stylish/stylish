# Skypager: Cloud Writing

Skypager is an experiment.  I want to develop a format for structured writing which allows people who write a lot to be able to easily link their ideas and words to dynamic data sources that traditionally depend on programmers or programming. Things like APIs, Databases, Public Datasets, Website Crawlers should be something anybody could incorporate into their work to 1) make their writing more impactful 2) make their written works semi-interactive and 3) automating the discipline and practice of keeping writing up to date as the subject matter it describes evolves and changes over time.

With this combination of writing and data, I want it to be dead simple to publish the body of work to internet, and for the content to update itself whenever any of the underlying source material - writing, data, etc - changes or evolves.

Skypager lets a writer create `Projects`.  A `Project` is a folder which consists will consist of mostly Markdown documents, which should be categorized in some way that documents of the same type follow consistent structure, especially in the heading hierarchy. Skypager will attempt to learn and understand this structure, and it of course let the writer specify this structure.  From this writing and data, we build an Entity model and provide an esy to use ORM wrapper that allows a project's written content to be used in a tradtional database / active record style application.

In addition to Markdown, a Skypager project can contain CSV, Spreadsheets, YAML Files, JSON Files, or javascripts which return JSON.  These `DataSource` documents can easily be referenced in the Markdown, since they will almost always usually be a better way to capture a large amount of information / large number of entities, etc.

## Installation

`npm install skypager -g`

## Status

Currently this project is not well documented, and is in need of a good CLI interface to make it easier to generate new projects, new helpers, new documents, etc.  Documentation / Examples are spread across the `test/fixture` folder.  This Skypager project consists of runnable documentation which acts as a test suite and API documentation, and serves as the `Object under test` in the test suite.

## Currently Hiring 

Currently hiring part time / freelance / remote people to contribute to this project.  It will be open sourced.  Email `jon@chicago.com` for more info.
