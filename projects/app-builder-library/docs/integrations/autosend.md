---
name: Autosend
website: http://autosend.io/
categories:
- Email
platforms:
  browser: true
  mobile: false
  server: false
---

# Autosend

Autosend lets you send email and SMS messages to your online customers based on what they do on your website.

[Product Website](http://autosend.io/)

## Basic Options

- *App Key*: You can find your Autosend API Key in Messages > Create New Message > Email/SMS > REST API, then click on the link next to the red wrench that says 'Follow these instructions'.


## Segment Data
```yaml
---
name: Autosend
slug: autosend
createdAt: '2015-01-27T03:12:06Z'
note: ''
website: http://autosend.io/
description: Autosend lets you send email and SMS messages to your online customers
  based on what they do on your website.
level: 3
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
- appKey
advancedOptions: []
options:
  appKey:
    default: ''
    description: You can find your Autosend API Key in Messages > Create New Message
      > Email/SMS > REST API, then click on the link next to the red wrench that says
      'Follow these instructions'.
    label: App Key
    type: string
public: true
redshift: false
logos:
  default: https://s3.amazonaws.com/segmentio/logos/autosend-default.svg

```

