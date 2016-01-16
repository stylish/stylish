---
name: Tableau
website: http://www.tableau.com/
categories:
- Analytics
- SQL
platforms:
  browser: true
  mobile: true
  server: true
---

# Tableau

Tableau allows you to connect, query, and visualize your data without writing code.  Use Tableau's drag-and-drop interface to create powerful in-depth analyses, or create simple dashboards to keep an eye on your data

[Product Website](http://www.tableau.com/)

## Basic Options

- *Host*: Your database host, so that Tableau can connect to the correct SQL database.
- *Port*: Your SQL database port, so that Tableau can connect to the correct SQL database.
- *Database Name*: Your SQL database, so that Tableau can connect to the correct SQL database.
- *Database Username*: Your SQL username, so that Tableau can connect to the database.
- *Port*: Your SQL database port, so that Tableau can connect to the correct SQL database.


## Segment Data
```yaml
---
name: Tableau
slug: tableau
createdAt: '2014-10-05T00:07:26Z'
note: SQL integrations are only available on the business plan. They connect to your
  Segment SQL database powered by Amazon Redshift.
website: http://www.tableau.com/
description: Tableau allows you to connect, query, and visualize your data without
  writing code.  Use Tableau's drag-and-drop interface to create powerful in-depth
  analyses, or create simple dashboards to keep an eye on your data
level: 5
categories:
- Analytics
- SQL
popularity: 0
platforms:
  browser: true
  mobile: true
  server: true
methods:
  alias: true
  group: true
  identify: true
  pageview: true
  track: true
basicOptions:
- host
- port
- database
- username
- password
advancedOptions: []
options:
  database:
    default: ''
    description: Your SQL database, so that Tableau can connect to the correct SQL
      database.
    label: Database Name
    private: true
    readonly: true
    type: string
  host:
    default: ''
    description: Your database host, so that Tableau can connect to the correct SQL
      database.
    label: Host
    private: true
    readonly: true
    type: string
  password:
    default: ''
    description: Your SQL database port, so that Tableau can connect to the correct
      SQL database.
    label: Port
    private: true
    readonly: true
    type: string
  port:
    default: ''
    description: Your SQL database port, so that Tableau can connect to the correct
      SQL database.
    label: Port
    private: true
    readonly: true
    type: string
  username:
    default: readonly
    description: Your SQL username, so that Tableau can connect to the database.
    label: Database Username
    private: true
    readonly: true
    type: string
public: true
redshift: true
logos:
  default: https://s3.amazonaws.com/segmentio/logos/tableau-default.svg

```

