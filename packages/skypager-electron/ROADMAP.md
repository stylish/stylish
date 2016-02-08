# Workspaces

Pre-defined arrangements of panels.

# Panels 

A Panel is an `electron.BrowserWindow`

Panels may have background or child processes they are dependent on to show their content.

In development this could take the form of waiting for webpack development server, in production it
might take the form of spawning a child process and wanting to update the UI based on what happens.
