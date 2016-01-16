---
name: Flurry
website: http://flurry.com
categories:
- Analytics
- Advertising
- Push Notifications
platforms:
  browser: false
  mobile: true
  server: false
---

# Flurry

Flurry is the most popular analytics tool for mobile apps because it has a wide assortment of features. It also helps you advertise to the right audiences with your apps.

[Product Website](http://flurry.com)

## Basic Options

- *API Key*: You can find your API Key on the Flurry [Manage App Info page](http://flurry.com/dashboard).

## Advanced Options

- *Log Uncaught Exceptions to Flurry*: Enabling this will log uncaught exceptions.
- *Send Data to Flurry Over HTTPS*: Enabling this will send data to Flurry securely. This option is ignored for the latest versions of the Flurry SDK, which use HTTPS by default.
- *Session Continue Seconds*: The number of seconds the app can be in the background before starting a new Flurry session upon resume. Default from Flurry is 10 seconds.
- *Screen Tracks As Events*: Enabling this will send data through screen calls as events (in addition to pageviews).

## Segment Data
```yaml
---
name: Flurry
slug: flurry
createdAt: '2013-05-14T23:02:41Z'
note: ''
website: http://flurry.com
description: Flurry is the most popular analytics tool for mobile apps because it
  has a wide assortment of features. It also helps you advertise to the right audiences
  with your apps.
level: 1
categories:
- Analytics
- Advertising
- Push Notifications
popularity: 0.016542329
platforms:
  browser: false
  mobile: true
  server: false
methods:
  alias: false
  group: false
  identify: true
  page: false
  screen: true
  track: true
basicOptions:
- apiKey
advancedOptions:
- captureUncaughtExceptions
- useHttps
- sessionContinueSeconds
- screenTracksEvents
options:
  apiKey:
    default: ''
    description: You can find your API Key on the Flurry [Manage App Info page](http://flurry.com/dashboard).
    label: API Key
    type: string
    validators:
    - - required
      - Please enter your API Key.
    - - regexp
      - "^[A-Z0-9]{20}$"
      - 'Please double check your API Key. It should be 20 characters long, and look
        something like this: `HP8HXZ28MWPB7JPBYNZD`.'
  captureUncaughtExceptions:
    default: false
    description: Enabling this will log uncaught exceptions.
    label: Log Uncaught Exceptions to Flurry
    type: boolean
  reportLocation:
    default: true
    description: Enabling this will send tell the Flurry SDK to automatically collect
      the user location.
    label: Collect User Location
    type: boolean
  screenTracksEvents:
    default: true
    description: Enabling this will send data through screen calls as events (in addition
      to pageviews).
    label: Screen Tracks As Events
    type: boolean
  sessionContinueSeconds:
    default: 10
    description: The number of seconds the app can be in the background before starting
      a new Flurry session upon resume. Default from Flurry is 10 seconds.
    label: Session Continue Seconds
    max: 10000
    min: 1
    type: number
    validators:
    - - number
      - Please double check your Session Continue Seconds time. It should be a whole
        number.
  useHttps:
    default: true
    description: Enabling this will send data to Flurry securely. This option is ignored
      for the latest versions of the Flurry SDK, which use HTTPS by default.
    label: Send Data to Flurry Over HTTPS
    type: boolean
public: true
redshift: false
logos:
  default: https://s3.amazonaws.com/segmentio/logos/flurry-default.svg

```

