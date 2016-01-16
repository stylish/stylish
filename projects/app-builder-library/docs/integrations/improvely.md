---
name: Improvely
website: http://improvely.com
categories:
- Attribution
platforms:
  browser: true
  mobile: false
  server: false
---

# Improvely

Improvely helps marketers with campaign attribution, conversion tracking, and click fraud monitoring.

[Product Website](http://improvely.com)

## Basic Options

- *Domain*: You can find your Improvely domain in your Improvely analytics code snippet as `im_domain`.
- *Project ID*: You can find your Improvely project id in your Improvely analytics code snippet as `im_project_id`.


## Segment Data
```yaml
---
name: Improvely
slug: improvely
createdAt: '2013-08-02T22:53:36Z'
note: ''
website: http://improvely.com
description: Improvely helps marketers with campaign attribution, conversion tracking,
  and click fraud monitoring.
level: 3
categories:
- Attribution
popularity: 0.0019461564
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
- domain
- projectId
advancedOptions: []
options:
  domain:
    default: ''
    description: You can find your Improvely domain in your Improvely analytics code
      snippet as `im_domain`.
    label: Domain
    type: string
    validators:
    - - required
      - Please enter your Improvely Domain.
  projectId:
    default: ''
    description: You can find your Improvely project id in your Improvely analytics
      code snippet as `im_project_id`.
    label: Project ID
    type: string
    validators:
    - - required
      - Please enter your Project ID.
public: true
redshift: false
logos:
  default: https://s3.amazonaws.com/segmentio/logos/improvely-default.svg

```

