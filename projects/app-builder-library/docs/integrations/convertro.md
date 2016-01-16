---
name: Convertro
website: http://www.convertro.com/
categories:
- Attribution
platforms:
  browser: true
  mobile: false
  server: false
---

# Convertro

Convertro helps marketers understand where to allocate budget across channels at the most granular level, to maximize ad performance and accelerate growth

[Product Website](http://www.convertro.com/)

## Basic Options

- *Account*: Enter your Convertro Account Name
- *Events*: Convertro only wants to receive specific events. For each conversion event you want to send to Convertro, put the event name you send to Segment on the left, and the name you want Convertro to receive it as on the right.

## Advanced Options

- *Hybrid Attribution Model*: This will make **Completed Order** events always send a `sale` event in addition to a `sale.new` or `sale.repeat` event if it has a boolean `repeat` property.

## Segment Data
```yaml
---
name: Convertro
slug: convertro
createdAt: '2014-02-12T18:16:07Z'
note: ''
website: http://www.convertro.com/
description: Convertro helps marketers understand where to allocate budget across
  channels at the most granular level, to maximize ad performance and accelerate growth
level: 5
categories:
- Attribution
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
- account
- events
advancedOptions:
- hybridAttributionModel
options:
  account:
    default: ''
    description: Enter your Convertro Account Name
    label: Account
    type: string
    validators:
    - - required
      - Please enter your Convertro Account Name.
  events:
    default: {}
    description: Convertro only wants to receive specific events. For each conversion
      event you want to send to Convertro, put the event name you send to Segment
      on the left, and the name you want Convertro to receive it as on the right.
    label: Events
    type: text-map
  hybridAttributionModel:
    default: false
    description: This will make **Completed Order** events always send a `sale` event
      in addition to a `sale.new` or `sale.repeat` event if it has a boolean `repeat`
      property.
    label: Hybrid Attribution Model
    type: boolean
public: true
redshift: false
logos:
  default: https://s3.amazonaws.com/segmentio/logos/convertro-default.svg

```

