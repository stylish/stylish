---
name: Woopra
website: http://woopra.com
categories:
- Analytics
- Realtime Dashboards
platforms:
  browser: true
  mobile: true
  server: true
---

# Woopra

Woopra is a customer analytics tool that builds a lifecycle timeline for each of your users, giving you a look into their entire history with your product.

[Product Website](http://woopra.com)

## Basic Options

- *Domain*: You can find your Woopra domain at <a href="https://www.woopra.com">Woopra</a>.

## Advanced Options

- *Cookie Name*: Name of the cookie to identify the visitor.
- *Cookie Path*: Directory scope of the Woopra cookie
- *Ping*: Ping Woopra servers to ensure that the visitor is still on the webpage
- *Ping Interval*: Time interval in milliseconds between each ping
- *Idle Timeout*: Idle time after which the user is considered offline
- *Download Tracking*: Track downloads on the web page
- *Outgoing Tracking*: Track external links clicks on the web page
- *Outgoing Ignore Subdomains*: Do not include links to subdomains as outgoing links
- *Download Pause*: Time in millisecond to pause the browser to ensure that the event is tracked when visitor clicks on a download url.
- *Outgoing Pause*: Time in millisecond to pause the browser to ensure that the event is tracked when visitor clicks on an outgoing url.
- *Ignore Query URL*: Ignores the querystring when you `page()`
- *Hide Campaign*: Enable if you want woopra to hide campaign properties from the URL

## Segment Data
```yaml
---
name: Woopra
slug: woopra
createdAt: '2013-03-28T03:00:46Z'
note: ''
website: http://woopra.com
description: Woopra is a customer analytics tool that builds a lifecycle timeline
  for each of your users, giving you a look into their entire history with your product.
level: 3
categories:
- Analytics
- Realtime Dashboards
popularity: 0.034057736
platforms:
  browser: true
  mobile: true
  server: true
methods:
  alias: false
  group: false
  identify: true
  pageview: false
  track: true
basicOptions:
- domain
advancedOptions:
- cookieName
- cookiePath
- ping
- pingInterval
- idleTimeout
- downloadTracking
- outgoingTracking
- outgoingIgnoreSubdomains
- downloadPause
- outgoingPause
- ignoreQueryUrl
- hideCampaign
options:
  cookieDomain:
    default: ''
    description: Domain scope of the Woopra cookie
    label: Cookie Domain
    type: string
    validators: []
  cookieName:
    default: wooTracker
    description: Name of the cookie to identify the visitor.
    label: Cookie Name
    type: string
    validators:
    - - required
      - Please enter cookie name
  cookiePath:
    default: "/"
    description: Directory scope of the Woopra cookie
    label: Cookie Path
    type: string
    validators:
    - - required
      - Please enter cookie path
  domain:
    default: ''
    description: You can find your Woopra domain at <a href="https://www.woopra.com">Woopra</a>.
    label: Domain
    type: string
    validators:
    - - required
      - Please enter your Woopra Domain.
    - - regexp
      - "^(?!www\\.)"
      - Don't include the `www.`. Woopra will handle that for you automatically.
    - - domain
      - Please enter a valid domain name, like `company.com`.
  downloadPause:
    default: 200
    description: Time in millisecond to pause the browser to ensure that the event
      is tracked when visitor clicks on a download url.
    label: Download Pause
    type: number
  downloadTracking:
    default: true
    description: Track downloads on the web page
    label: Download Tracking
    type: boolean
  hideCampaign:
    default: false
    description: Enable if you want woopra to hide campaign properties from the URL
    label: Hide Campaign
    type: boolean
  idleTimeout:
    default: 300000
    description: Idle time after which the user is considered offline
    label: Idle Timeout
    type: number
  ignoreQueryUrl:
    default: true
    description: Ignores the querystring when you `page()`
    label: Ignore Query URL
    type: boolean
  outgoingIgnoreSubdomains:
    default: true
    description: Do not include links to subdomains as outgoing links
    label: Outgoing Ignore Subdomains
    type: boolean
  outgoingPause:
    default: 400
    description: Time in millisecond to pause the browser to ensure that the event
      is tracked when visitor clicks on an outgoing url.
    label: Outgoing Pause
    type: number
  outgoingTracking:
    default: true
    description: Track external links clicks on the web page
    label: Outgoing Tracking
    type: boolean
  ping:
    default: true
    description: Ping Woopra servers to ensure that the visitor is still on the webpage
    label: Ping
    type: boolean
  pingInterval:
    default: 12000
    description: Time interval in milliseconds between each ping
    label: Ping Interval
    type: number
public: true
redshift: false
logos:
  default: https://s3.amazonaws.com/segmentio/logos/woopra-default.svg

```

