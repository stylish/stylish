# Skypager Services

Services are things you can interact with by running commands and queries against them.

Interactions with a Service all take place through a promise based interface.

A Service might be something like Github, Google Drive, or a Segment.io Client which can act as a gateway to hundreds of different services.

Each Service exposes metadata about the configuration parameters it needs at an environment level, as well as at the command and query level.
