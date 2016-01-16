---
name: Natero
website: http://www.natero.com/
categories:
- Analytics
platforms:
  browser: true
  mobile: true
  server: true
---

# Natero

Natero is a cloud-based analytics platform designed for the non-coders.

[Product Website](http://www.natero.com/)

## Basic Options

- *Send Key*: To retrieve your Send Key first navigate to Sources > List Sources. Select your source, and then click the 'Select View' dropdown, and select 'View Settings'.
- *Auth Key*: To retrieve your Auth Key first navigate to Sources > List Sources. Select your source, and then click the 'Select View' dropdown, and select 'View Settings'.


## Segment Data
```yaml
---
name: Natero
slug: natero
createdAt: '2015-01-20T21:17:18.546Z'
note: ''
website: http://www.natero.com/
description: Natero is a cloud-based analytics platform designed for the non-coders.
level: 1
categories:
- Analytics
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
- sendKey
- authKey
advancedOptions: []
options:
  authKey:
    default: ''
    description: To retrieve your Auth Key first navigate to Sources > List Sources.
      Select your source, and then click the 'Select View' dropdown, and select 'View
      Settings'.
    label: Auth Key
    type: string
    validators:
    - - required
      - Please enter your Auth Key
  sendKey:
    default: ''
    description: To retrieve your Send Key first navigate to Sources > List Sources.
      Select your source, and then click the 'Select View' dropdown, and select 'View
      Settings'.
    label: Send Key
    type: string
    validators:
    - - required
      - Please enter your Send Key
public: true
redshift: false
logos:
  default: https://s3.amazonaws.com/segmentio/logos/natero-default.svg

```

