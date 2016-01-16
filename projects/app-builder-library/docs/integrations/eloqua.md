---
name: Eloqua
website: http://www.eloqua.com/
categories:
- Email
platforms:
  browser: true
  mobile: true
  server: true
---

# Eloqua

Transform the way you approach sales and marketing with Eloqua's leading marketing automation and revenue performance management solution.

[Product Website](http://www.eloqua.com/)

## Basic Options

- *Site ID*: Enter your Site ID
- *Company Name*: Enter your login company name
- *Username*: Enter your login username
- *Password*: Enter your login passord


## Segment Data
```yaml
---
name: Eloqua
slug: eloqua
createdAt: '2014-02-11T16:26:48Z'
note: ''
website: http://www.eloqua.com/
description: Transform the way you approach sales and marketing with Eloqua's leading
  marketing automation and revenue performance management solution.
level: 5
categories:
- Email
popularity: 0
platforms:
  browser: true
  mobile: true
  server: true
methods:
  alias: false
  group: false
  identify: true
  pageview: true
  track: false
basicOptions:
- siteId
- companyName
- username
- password
advancedOptions: []
options:
  companyName:
    default: ''
    description: Enter your login company name
    label: Company Name
    private: true
    type: string
    validators:
    - - required
      - Please enter your Eloqua login company name.
  password:
    default: ''
    description: Enter your login passord
    label: Password
    private: true
    type: password
    validators:
    - - required
      - Please enter your Eloqua login password.
  siteId:
    default: ''
    description: Enter your Site ID
    label: Site ID
    type: string
    validators:
    - - required
      - Please enter your Eloqua site ID.
  username:
    default: ''
    description: Enter your login username
    label: Username
    private: true
    type: string
    validators:
    - - required
      - Please enter your Eloqua login username.
public: true
redshift: false
logos:
  default: https://s3.amazonaws.com/segmentio/logos/eloqua-default.svg

```

