---
name: Mojn
website: http://mojn.com
categories:
- Email
platforms:
  browser: true
  mobile: false
  server: false
---

# Mojn

Mojn is an e-commerce email marketing tool that enables you to automatically personalize each email campaign with a recommendation image. Works with all major ESPs (e.g. Mailchimp).

[Product Website](http://mojn.com)

## Basic Options

- *Site Code*: Enter your Mojn Site Code


## Segment Data
```yaml
---
name: Mojn
slug: mojn
createdAt: '2014-02-10T16:36:55Z'
note: ''
website: http://mojn.com
description: Mojn is an e-commerce email marketing tool that enables you to automatically
  personalize each email campaign with a recommendation image. Works with all major
  ESPs (e.g. Mailchimp).
level: 1
categories:
- Email
popularity: 0
platforms:
  browser: true
  mobile: false
  server: false
methods:
  alias: false
  group: false
  identify: true
  pageview: false
  track: true
basicOptions:
- customerCode
advancedOptions: []
options:
  customerCode:
    default: ''
    description: Enter your Mojn Site Code
    label: Site Code
    type: string
    validators:
    - - required
      - Please enter your Site Code.
public: true
redshift: false
logos:
  default: https://s3.amazonaws.com/segmentio/logos/mojn-default.svg

```

