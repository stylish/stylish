---
name: TellApart
website: http://www.tellapart.com/
categories:
- Advertising
platforms:
  browser: true
  mobile: false
  server: false
---

# TellApart

TellApart is a predictive ad retargeting tool for e-commerce sites.

[Product Website](http://www.tellapart.com/)

## Basic Options

- *Site ID*: Your Site ID from TellApart, provided to you by your TellApart account manager.


## Segment Data
```yaml
---
name: TellApart
slug: tellapart
createdAt: '2014-08-26T03:20:18.675Z'
note: ''
website: http://www.tellapart.com/
description: TellApart is a predictive ad retargeting tool for e-commerce sites.
level: 5
categories:
- Advertising
popularity: 0
platforms:
  browser: true
  mobile: false
  server: false
methods:
  alias: false
  group: false
  identify: true
  pageview: true
  track: true
basicOptions:
- siteId
advancedOptions: []
options:
  siteId:
    default: ''
    description: Your Site ID from TellApart, provided to you by your TellApart account
      manager.
    label: Site ID
    type: string
    validators:
    - - required
      - Please enter your Site ID.
    - - regexp
      - "^[a-zA-Z0-9]+$"
      - 'Please double check your Account ID. It should be a string of random characters,
        for example: Vpwr5FMdCcM1.'
public: true
redshift: false
logos:
  default: https://s3.amazonaws.com/segmentio/logos/tell-apart-default.svg

```

