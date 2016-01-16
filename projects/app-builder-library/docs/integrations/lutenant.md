---
name: Lutenant
website: http://www.lutenant.com
categories:
- Customer Success
platforms:
  browser: true
  mobile: true
  server: true
---

# Lutenant

Lutenant is a Customer Success tool designed to grow and renew your customers. It features churn- and up-sell alerts, a proactive todo-feed, Playbooks, strong SaaS reporting, and a visual overview of your customers.

[Product Website](http://www.lutenant.com)

## Basic Options

- *Apikey*: Add your Lutenant API Key which you can generate in Lutenant under App Settings > API Access


## Segment Data
```yaml
---
name: Lutenant
slug: lutenant
createdAt: '2015-05-15T10:55:12Z'
note: ''
website: http://www.lutenant.com
description: Lutenant is a Customer Success tool designed to grow and renew your customers.
  It features churn- and up-sell alerts, a proactive todo-feed, Playbooks, strong
  SaaS reporting, and a visual overview of your customers.
level: 1
categories:
- Customer Success
popularity: 0
platforms:
  browser: true
  mobile: true
  server: true
methods:
  alias: false
  group: false
  identify: true
  pageview: false
  track: false
basicOptions:
- apiKey
advancedOptions: []
options:
  apiKey:
    default: ''
    description: Add your Lutenant API Key which you can generate in Lutenant under
      App Settings > API Access
    label: Apikey
    type: string
    validators:
    - - required
      - Please enter your Apikey
  direct:
    default: true
    private: true
    type: boolean
  endpoint:
    default: https://api.lutenant.com/dock/segment
    type: string
public: true
redshift: false
logos:
  default: https://s3.amazonaws.com/segmentio/logos/lutenant-default.svg

```

