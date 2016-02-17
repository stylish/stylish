import blessed from 'blessed';

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

  // Don't overwrite the screen
  console.log = function () { };
  console.warn = function () { };
  console.error = function () { };
  console.info = function () { };
  console.debug = function () { };
}

export default dashboard
