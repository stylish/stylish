import React from 'react';
import blessed from 'blessed';
import { render } from 'react-blessed';
import App from './App';

export function dashboard(server, options) {
   // Create our screen
  const screen = blessed.screen({
    autoPadding: true,
    smartCSR: true,
    title: 'Skypager',
    dockBorders: true
  });

  // Let user quit the app
  screen.key(['escape', 'q', 'C-c'], function(ch, key) {
    return process.exit(0);
  });

  // Render React component into screen
  render(<App processes={server.processes}
              streamer={server.streamer}
              options={options}
              project={server.project}
              screen={screen} />, screen)

  // Don't overwrite the screen
  console.log = function () { };
  console.warn = function () { };
  console.error = function () { };
  console.info = function () { };
  console.debug = function () { };
}

export default dashboard
