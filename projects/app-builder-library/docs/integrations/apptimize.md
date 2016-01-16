---
name: Apptimize
website: https://apptimize.com/
categories:
- A/B Testing
platforms:
  browser: false
  mobile: true
  server: true
---

# Apptimize

Apptimize is a technology enabling users to A/B test their native applications on Android and iOS platforms.

[Product Website](https://apptimize.com/)

## Basic Options

- *App Key*: You can find your App Key on the Apptimize [settings page](https://apptimize.com/admin/settings/apps)


## Segment Data
```yaml
---
name: Apptimize
slug: apptimize
createdAt: '2014-04-22T20:48:41Z'
note: ''
website: https://apptimize.com/
description: Apptimize is a technology enabling users to A/B test their native applications
  on Android and iOS platforms.
level: 3
categories:
- A/B Testing
popularity: 0
platforms:
  browser: false
  mobile: true
  server: true
methods:
  alias: false
  group: false
  identify: true
  page: true
  track: true
basicOptions:
- appkey
advancedOptions: []
options:
  appkey:
    default: ''
    description: You can find your App Key on the Apptimize [settings page](https://apptimize.com/admin/settings/apps)
    label: App Key
    type: string
    validators:
    - - required
      - Please enter your Apptimize App Key
public: true
redshift: false
logos:
  default: https://s3.amazonaws.com/segmentio/logos/apptimize-default.svg

```

