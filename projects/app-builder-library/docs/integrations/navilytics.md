---
name: Navilytics
website: https://www.navilytics.com
categories:
- Heatmaps and Recordings
platforms:
  browser: true
  mobile: false
  server: false
---

# Navilytics

Navilytics provide powerful analytical tools from user recordings to heatmaps designed to increase conversions and website usability.

[Product Website](https://www.navilytics.com)

## Basic Options

- *Member ID*: You can find your Member ID in your Navilytics [code settings page](https://www.navilytics.com/member/code_settings).
- *Project ID*: You can find your Project ID in your Navilytics [code settings page](https://www.navilytics.com/member/code_settings).


## Segment Data
```yaml
---
name: Navilytics
slug: navilytics
createdAt: '2014-04-07T10:57:01Z'
note: ''
website: https://www.navilytics.com
description: Navilytics provide powerful analytical tools from user recordings to
  heatmaps designed to increase conversions and website usability.
level: 2
categories:
- Heatmaps and Recordings
popularity: 0
platforms:
  browser: true
  mobile: false
  server: false
methods:
  alias: false
  group: false
  identify: false
  pageview: false
  track: true
basicOptions:
- memberId
- projectId
advancedOptions: []
options:
  memberId:
    default: ''
    description: You can find your Member ID in your Navilytics [code settings page](https://www.navilytics.com/member/code_settings).
    label: Member ID
    type: string
    validators:
    - - required
      - Please enter your Member ID.
    - - regexp
      - "^[0-9]+$"
      - Please double check your Member ID. it should be a number.
  projectId:
    default: ''
    description: You can find your Project ID in your Navilytics [code settings page](https://www.navilytics.com/member/code_settings).
    label: Project ID
    type: string
    validators:
    - - required
      - Please enter your Project ID.
    - - regexp
      - "^[0-9]+$"
      - Please double check your Pixel ID. It should be a number.
public: true
redshift: false
logos:
  default: https://s3.amazonaws.com/segmentio/logos/navilytics-default.svg

```

