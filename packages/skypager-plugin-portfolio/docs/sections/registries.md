# Shared Helper Registry

The Skypager framework comes with its own collection of helpers that all Skypager Projects can use, and Projects can define their own helpers that may be unique to the project.

Portfolios can act as additional collections of helpers for projects which share things in common with each other.

When you interact with the helper registry in Skypager and ask for a helper by name, you first search within the project for that helper.  Normally if it is not found, it will use the fallback registry which is usually the Skypager framework.

Projects which belong to a portfolio, will search within their folders first, then the portfolio, then the framework.
