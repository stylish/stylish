# Skypager Semantics

A trainable markdown document parser that can be used for building semantic entity models. With this you can turn a folder of markdown documents into a seed file for generating a website or database application.

The document models can be trained or configured to identify what is being written about and how the concepts or things relate to one another. From this we can automatically infer links and references to additional data that might be found in obvious places such as external APIs, Databases, or Spreadsheets.

This data can also be used to establish links to source code repositories, system configuration files, or design assets or other files. Projects which follow a convention over configuration philosophy for how files are organized will be easier to work with.

## Process Writing

This is especially useful for the kinds of documents which should follow a familiar pattern.  A `README.md` file is a perfect example.  If you write a dozen README.md files for javascript projects which you publish to npm, then having a document model for your `README.md` could be used to generate code, or your code could be used to generate your `README.md`

## Features

- Infer belongs to, has many, has and belongs to many style relationships
- Entity Extraction



